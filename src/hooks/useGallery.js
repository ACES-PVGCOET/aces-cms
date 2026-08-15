import { useState, useEffect, useMemo, useCallback } from 'react';
import { galleryApi } from '../services/api';
import { INITIAL_GALLERY } from '../data/mockData';

export const GALLERY_CATEGORIES = [
  'All Media',
  'Hackathons',
  'Workshops',
  'Mixers',
  'Behind the Scenes',
  'Keynotes',
];

function normalizeGalleryItem(item) {
  return {
    id: item.id || item._id,
    type: item.media_type || item.type || 'image',
    title: item.title || 'ACES Visual Media',
    category: item.collection_name || item.category || 'Hackathons',
    thumbnail: item.media_url || item.thumbnail || item.src,
    src: item.media_url || item.src || item.thumbnail,
    videoUrl: item.media_type === 'video' ? item.media_url : item.videoUrl || '',
    duration: item.duration || (item.media_type === 'video' ? '1:00' : null),
    author: item.auditing?.created_by?.name || item.author || 'ACES Media Guild',
    date: item.auditing?.created_at ? new Date(item.auditing.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    likes: item.likes || 0,
    tags: item.tags || ['ACES', 'Gallery'],
    description: item.caption || item.description || '',
  };
}

/**
 * useGallery Hook
 * Manages gallery media assets connected directly to backend API (/gallery/items).
 */
export function useGallery() {
  const [mediaItems, setMediaItems] = useState(INITIAL_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState('All Media');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all' | 'image' | 'video'
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollOrientation, setScrollOrientation] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [selectedMedia, setSelectedMedia] = useState(null); // Lightbox active item
  const [likedMap, setLikedMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch gallery items from backend API on mount
  const fetchFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiData = await galleryApi.getItems();
      if (Array.isArray(apiData) && apiData.length > 0) {
        setMediaItems(apiData.map(normalizeGalleryItem));
      }
    } catch (e) {
      console.info('[Gallery Hook] API fetch warning:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromApi();
  }, [fetchFromApi]);

  // Filtered media items
  const filteredMedia = useMemo(() => {
    return mediaItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All Media' && item.category !== selectedCategory) {
        return false;
      }

      // Media type filter
      if (mediaTypeFilter !== 'all' && item.type !== mediaTypeFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = (item.title || '').toLowerCase().includes(q);
        const matchesAuthor = (item.author || '').toLowerCase().includes(q);
        const matchesCategory = (item.category || '').toLowerCase().includes(q);
        const matchesDesc = (item.description || '').toLowerCase().includes(q);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));

        return matchesTitle || matchesAuthor || matchesCategory || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [mediaItems, selectedCategory, mediaTypeFilter, searchQuery]);

  // Toggle Like
  const toggleLike = (id) => {
    setLikedMap((prev) => {
      const isLiked = !prev[id];
      return { ...prev, [id]: isLiked };
    });

    setMediaItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isCurrentlyLiked = likedMap[id];
          return {
            ...item,
            likes: isCurrentlyLiked ? item.likes - 1 : item.likes + 1,
          };
        }
        return item;
      })
    );
  };

  // Add new Media Item
  const addMediaItem = async (itemData) => {
    setIsLoading(true);
    const title = (itemData.title || '').trim();
    const media_url = itemData.src || itemData.media_url || itemData.thumbnail;
    const media_type = itemData.type || 'image';
    const collection_name = itemData.category || 'Hackathons';
    const caption = itemData.description || '';

    try {
      const apiResult = await galleryApi.createItem({
        title,
        caption,
        media_url,
        media_type,
        collection_name,
      });
      const newItem = normalizeGalleryItem({ ...itemData, ...apiResult });
      setMediaItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (e) {
      console.error('[Gallery Hook] API create item failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete media item
  const deleteMediaItem = async (id) => {
    setIsLoading(true);
    try {
      await galleryApi.deleteItem(id);
      setMediaItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedMedia?.id === id) {
        setSelectedMedia(null);
      }
    } catch (e) {
      console.error('[Gallery Hook] API delete item failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mediaItems,
    filteredMedia,
    selectedCategory,
    setSelectedCategory,
    mediaTypeFilter,
    setMediaTypeFilter,
    searchQuery,
    setSearchQuery,
    scrollOrientation,
    setScrollOrientation,
    selectedMedia,
    setSelectedMedia,
    likedMap,
    toggleLike,
    addMediaItem,
    deleteMediaItem,
    isLoading,
    refreshGallery: fetchFromApi,
  };
}
