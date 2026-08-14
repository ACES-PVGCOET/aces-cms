import { useState, useEffect, useMemo } from 'react';
import { INITIAL_GALLERY } from '../data/mockData';

const STORAGE_KEY = 'aces_cms_gallery_data';

export const GALLERY_CATEGORIES = [
  'All Media',
  'Hackathons',
  'Workshops',
  'Mixers',
  'Behind the Scenes',
  'Keynotes',
];

/**
 * useGallery Hook
 * Manages gallery media assets (images & videos), scroll orientations,
 * category filters, likes, and CRUD operations.
 */
export function useGallery() {
  const [mediaItems, setMediaItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load gallery from localStorage', e);
    }
    return INITIAL_GALLERY;
  });

  const [selectedCategory, setSelectedCategory] = useState('All Media');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all'); // 'all' | 'image' | 'video'
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollOrientation, setScrollOrientation] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [selectedMedia, setSelectedMedia] = useState(null); // Lightbox active item
  const [likedMap, setLikedMap] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mediaItems));
    } catch (e) {
      console.warn('Failed to save gallery to localStorage', e);
    }
  }, [mediaItems]);

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
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesAuthor = item.author.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
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

  // Add new Media
  const addMediaItem = (itemData) => {
    const newItem = {
      id: `aces-gal-${Date.now().toString().slice(-4)}`,
      type: itemData.type || 'image',
      title: itemData.title.trim(),
      category: itemData.category || 'Hackathons',
      thumbnail: itemData.thumbnail || itemData.src,
      src: itemData.src || itemData.thumbnail,
      videoUrl: itemData.videoUrl || '',
      duration: itemData.duration || (itemData.type === 'video' ? '1:00' : null),
      author: itemData.author || 'ACES Media Guild',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      tags: itemData.tags || ['ACES', 'Gallery'],
      description: itemData.description || 'ACES club visual capture.',
    };

    setMediaItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  // Delete media item
  const deleteMediaItem = (id) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedMedia?.id === id) {
      setSelectedMedia(null);
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
  };
}
