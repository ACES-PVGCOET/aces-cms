import { useState, useEffect, useCallback } from 'react';
import { announcementsApi } from '../services/api';

function normalizeAnnouncement(item) {
  return {
    id: item.id || item._id,
    topic: item.topic || 'ACES Announcement',
    description: item.description || '',
    created_by: item.created_by || null,
    updated_by: item.updated_by || null,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || item.created_at || new Date().toISOString(),
  };
}

/**
 * useAnnouncements Hook
 * Provides announcements list and broadcasting interface strictly connected to API schema.
 */
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch announcements from API on mount
  const fetchFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiData = await announcementsApi.getAll();
      if (Array.isArray(apiData)) {
        const normalized = apiData.map(normalizeAnnouncement);
        setAnnouncements(normalized);
      }
    } catch (e) {
      console.info('[Announcements Hook] API fetch error:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromApi();
  }, [fetchFromApi]);

  const addAnnouncement = async (newAnnouncement) => {
    const topic = (newAnnouncement.topic || newAnnouncement.title || '').trim();
    const description = (newAnnouncement.description || '').trim();

    try {
      setIsLoading(true);
      const apiResult = await announcementsApi.create({ topic, description });
      const finalItem = normalizeAnnouncement(apiResult);
      setAnnouncements((prev) => [finalItem, ...prev]);
      return finalItem;
    } catch (e) {
      console.error('[Announcements Hook] API create announcement failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnnouncement = async (id, updatedData) => {
    const topic = (updatedData.topic || updatedData.title || '').trim();
    const description = (updatedData.description || '').trim();

    try {
      setIsLoading(true);
      const apiResult = await announcementsApi.update(id, { topic, description });
      const updatedNorm = normalizeAnnouncement(apiResult);
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? updatedNorm : a)));
      return updatedNorm;
    } catch (e) {
      console.error('[Announcements Hook] API update announcement failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      setIsLoading(true);
      await announcementsApi.delete(id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error('[Announcements Hook] API delete announcement failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    isLoading,
    refreshAnnouncements: fetchFromApi,
  };
}

export default useAnnouncements;
