import { useState, useEffect, useMemo, useCallback } from 'react';
import { galleryApi } from '../services/api';

export const INITIAL_SHOWCASE_COLLECTIONS = [
  
];

export function useShowcase() {
  const [collections, setCollections] = useState(INITIAL_SHOWCASE_COLLECTIONS);
  const [activeCollection, setActiveCollection] = useState(null); // null = Folder Grid view; string = Inside specific folder
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all' | 'image' | 'video' | 'pdf'
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [renamingCollectionName, setRenamingCollectionName] = useState(null);
  const [viewingPdfItem, setViewingPdfItem] = useState(null);

  // Fetch showcase from API
  const fetchShowcase = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await galleryApi.getShowcase();
      if (res && res.collections && Array.isArray(res.collections) && res.collections.length > 0) {
        setCollections(res.collections);
      }
    } catch (err) {
      console.warn('[useShowcase] Failed to load showcase from API, using fallback:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShowcase();
  }, [fetchShowcase]);

  // Add new item to showcase
  const addMediaItem = async (itemData) => {
    try {
      const created = await galleryApi.createItem(itemData);
      await fetchShowcase();
      return created;
    } catch (err) {
      console.warn('[useShowcase] API create failed, adding locally:', err.message);
      const localId = `showcase-local-${Date.now()}`;
      const colName = itemData.collection_name.trim();
      const newItem = {
        id: localId,
        collection_name: colName,
        type: itemData.type || itemData.media_type || 'image',
        media_type: itemData.type || itemData.media_type || 'image',
        title: itemData.title || '',
        description: itemData.description || itemData.caption || '',
        url: itemData.url || itemData.media_url || '',
        media_url: itemData.url || itemData.media_url || '',
        cover_image: itemData.cover_image || itemData.coverImage || itemData.url || itemData.media_url || '',
        created_at: new Date().toISOString(),
      };

      setCollections((prev) => {
        const existingIdx = prev.findIndex((c) => c.collection_name.toLowerCase() === colName.toLowerCase());
        if (existingIdx !== -1) {
          const updated = [...prev];
          const col = { ...updated[existingIdx] };
          col.items = [newItem, ...col.items];
          col.total_items += 1;
          if (newItem.type === 'image') col.photos_count += 1;
          if (newItem.type === 'video') col.videos_count += 1;
          if (newItem.type === 'pdf') col.pdfs_count += 1;
          updated[existingIdx] = col;
          return updated;
        } else {
          return [
            {
              collection_name: colName,
              total_items: 1,
              photos_count: newItem.type === 'image' ? 1 : 0,
              videos_count: newItem.type === 'video' ? 1 : 0,
              pdfs_count: newItem.type === 'pdf' ? 1 : 0,
              cover_image: newItem.cover_image,
              items: [newItem],
            },
            ...prev,
          ];
        }
      });
      return newItem;
    }
  };

  // Update existing media item
  const updateMediaItem = async (id, itemData) => {
    try {
      const updated = await galleryApi.updateItem(id, itemData);
      await fetchShowcase();
      return updated;
    } catch (err) {
      console.warn('[useShowcase] API update failed, updating locally:', err.message);
      setCollections((prev) =>
        prev.map((col) => {
          const hasItem = col.items.some((it) => it.id === id);
          if (!hasItem) return col;

          const updatedItems = col.items.map((it) => {
            if (it.id !== id) return it;
            return {
              ...it,
              ...itemData,
              type: itemData.type || itemData.media_type || it.type,
              media_type: itemData.type || itemData.media_type || it.media_type,
              url: itemData.url || itemData.media_url || it.url,
              media_url: itemData.url || itemData.media_url || it.media_url,
              description: itemData.description !== undefined ? itemData.description : it.description,
            };
          });

          return {
            ...col,
            items: updatedItems,
          };
        })
      );
    }
  };

  // Delete media item
  const deleteMediaItem = async (id) => {
    try {
      await galleryApi.deleteItem(id);
      await fetchShowcase();
    } catch (err) {
      console.warn('[useShowcase] API delete failed, removing locally:', err.message);
      setCollections((prev) =>
        prev
          .map((col) => {
            const item = col.items.find((it) => it.id === id);
            if (!item) return col;

            const filteredItems = col.items.filter((it) => it.id !== id);
            return {
              ...col,
              items: filteredItems,
              total_items: Math.max(0, col.total_items - 1),
              photos_count: item.type === 'image' ? Math.max(0, col.photos_count - 1) : col.photos_count,
              videos_count: item.type === 'video' ? Math.max(0, col.videos_count - 1) : col.videos_count,
              pdfs_count: item.type === 'pdf' ? Math.max(0, col.pdfs_count - 1) : col.pdfs_count,
            };
          })
          .filter((col) => col.items.length > 0)
      );
    }
  };

  // Rename collection
  const renameCollection = async (oldName, newName) => {
    if (!oldName || !newName || oldName === newName) return;
    const trimmedOld = oldName.trim();
    const trimmedNew = newName.trim();

    try {
      await galleryApi.renameCollection(trimmedOld, trimmedNew);
      await fetchShowcase();
      if (activeCollection === trimmedOld) {
        setActiveCollection(trimmedNew);
      }
    } catch (err) {
      console.warn('[useShowcase] API rename collection failed, renaming locally:', err.message);
      setCollections((prev) =>
        prev.map((col) => {
          if (col.collection_name.toLowerCase() !== trimmedOld.toLowerCase()) return col;
          return {
            ...col,
            collection_name: trimmedNew,
            items: col.items.map((it) => ({ ...it, collection_name: trimmedNew })),
          };
        })
      );
      if (activeCollection === trimmedOld) {
        setActiveCollection(trimmedNew);
      }
    }
  };

  // Active collection object
  const currentCollectionObject = useMemo(() => {
    if (!activeCollection) return null;
    return collections.find(
      (c) => c.collection_name.toLowerCase() === activeCollection.toLowerCase()
    );
  }, [collections, activeCollection]);

  // Filtered collections or items based on search query
  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections;
    const query = searchQuery.toLowerCase();
    return collections.filter(
      (c) =>
        c.collection_name.toLowerCase().includes(query) ||
        c.items.some(
          (it) =>
            it.title.toLowerCase().includes(query) ||
            (it.description && it.description.toLowerCase().includes(query))
        )
    );
  }, [collections, searchQuery]);

  // Items inside active collection filtered by searchQuery & mediaTypeFilter
  const activeCollectionItems = useMemo(() => {
    if (!currentCollectionObject) return [];
    let list = currentCollectionObject.items || [];

    if (mediaTypeFilter !== 'all') {
      list = list.filter((it) => (it.type || it.media_type) === mediaTypeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          (it.description && it.description.toLowerCase().includes(q))
      );
    }

    return list;
  }, [currentCollectionObject, mediaTypeFilter, searchQuery]);

  // Overall showcase stats
  const showcaseStats = useMemo(() => {
    const totalCollections = collections.length;
    let totalItems = 0;
    let totalPhotos = 0;
    let totalVideos = 0;
    let totalPdfs = 0;

    for (const col of collections) {
      totalItems += col.total_items || col.items?.length || 0;
      totalPhotos += col.photos_count || 0;
      totalVideos += col.videos_count || 0;
      totalPdfs += col.pdfs_count || 0;
    }

    return {
      totalCollections,
      totalItems,
      totalPhotos,
      totalVideos,
      totalPdfs,
    };
  }, [collections]);

  return {
    collections,
    filteredCollections,
    activeCollection,
    setActiveCollection,
    currentCollectionObject,
    activeCollectionItems,
    searchQuery,
    setSearchQuery,
    mediaTypeFilter,
    setMediaTypeFilter,
    showcaseStats,
    isLoading,
    fetchShowcase,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    renameCollection,

    // Modals
    isAddModalOpen,
    setIsAddModalOpen,
    editingItem,
    setEditingItem,
    renamingCollectionName,
    setRenamingCollectionName,
    viewingPdfItem,
    setViewingPdfItem,
  };
}

export default useShowcase;
