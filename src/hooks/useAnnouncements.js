import { useState, useEffect } from 'react';
import { INITIAL_ANNOUNCEMENTS } from '../data/mockData';

const STORAGE_KEY = 'aces_cms_announcements_data';

/**
 * useAnnouncements Hook
 * Provides announcements list and marketing team broadcasting interface.
 */
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load announcements from localStorage', e);
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
    } catch (e) {
      console.warn('Failed to save announcements to localStorage', e);
    }
  }, [announcements]);

  const addAnnouncement = (newAnnouncement) => {
    const item = {
      id: `aces-ann-${Date.now().toString().slice(-4)}`,
      title: newAnnouncement.title,
      category: newAnnouncement.category || 'General',
      targetAudience: newAnnouncement.targetAudience || 'All Members',
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'Published',
      author: newAnnouncement.author || 'ACES Admin',
      summary: newAnnouncement.summary,
    };
    setAnnouncements((prev) => [item, ...prev]);
    return item;
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    announcements,
    addAnnouncement,
    deleteAnnouncement,
  };
}
