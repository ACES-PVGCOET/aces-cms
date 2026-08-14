import { useState, useEffect, useMemo } from 'react';
import { INITIAL_MAGAZINES } from '../data/mockData';

const STORAGE_KEY = 'aces_cms_magazines_data';

/**
 * useMagazines Hook
 * Provides plug-and-play state management, academic year filtering,
 * search filtering, and CRUD operations for ACES club magazines.
 * Future backend integration: Replace localStorage with axios/fetch calls.
 */
export function useMagazines() {
  const [magazines, setMagazines] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load magazines from localStorage', e);
    }
    return INITIAL_MAGAZINES;
  });

  const [selectedYear, setSelectedYear] = useState('All Years');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [viewingPdfMagazine, setViewingPdfMagazine] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(magazines));
    } catch (e) {
      console.warn('Failed to save magazines to localStorage', e);
    }
  }, [magazines]);

  // Filtered and sorted magazines list
  const filteredMagazines = useMemo(() => {
    return magazines.filter((mag) => {
      // Academic year filter
      if (selectedYear !== 'All Years' && mag.academicYear !== selectedYear) {
        return false;
      }

      // Search query filter (title, editor, edition, tags)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = mag.title?.toLowerCase().includes(q);
        const matchesEditor = mag.editor?.toLowerCase().includes(q);
        const matchesEdition = mag.edition?.toLowerCase().includes(q);
        const matchesTags = mag.tags?.some((t) => t.toLowerCase().includes(q));

        return matchesTitle || matchesEditor || matchesEdition || matchesTags;
      }

      return true;
    });
  }, [magazines, selectedYear, searchQuery]);

  // Aggregated magazine statistics
  const magazineStats = useMemo(() => {
    const totalEditions = magazines.length;
    const currentYearCount = magazines.filter((m) => m.academicYear === '2026-27').length;
    const totalDownloads = magazines.reduce((sum, m) => sum + (m.downloadsCount || 0), 0);
    const totalReads = magazines.reduce((sum, m) => sum + (m.readsCount || 0), 0);

    return {
      totalEditions,
      currentYearCount: `${currentYearCount} in 2026-27`,
      totalEngagements: `${(totalDownloads + totalReads).toLocaleString()} Reads & Downloads`,
    };
  }, [magazines]);

  // Add Magazine Edition
  const addMagazine = (newMagData) => {
    const newMag = {
      id: `aces-mag-${Date.now().toString().slice(-4)}`,
      title: newMagData.title.trim(),
      edition: newMagData.edition?.trim() || 'Volume 12, Issue 1',
      academicYear: newMagData.academicYear || '2026-27',
      coverImage:
        newMagData.coverImage?.trim() ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      publishedDate: newMagData.publishedDate || new Date().toISOString().split('T')[0],
      editor: newMagData.editor?.trim() || 'ACES Editorial Team',
      pageCount: Number(newMagData.pageCount) || 50,
      downloadsCount: 0,
      readsCount: 0,
      pdfUrl:
        newMagData.pdfUrl?.trim() ||
        'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      featured: Boolean(newMagData.featured),
      description:
        newMagData.description?.trim() ||
        'Official ACES club technical publication featuring student engineering articles and design showcases.',
      tags: newMagData.tags || ['ACES', 'Publication', newMagData.academicYear || '2026-27'],
    };

    setMagazines((prev) => [newMag, ...prev]);
    return newMag;
  };

  // Update Magazine Edition
  const updateMagazine = (id, updatedData) => {
    setMagazines((prev) =>
      prev.map((mag) => {
        if (mag.id === id) {
          return {
            ...mag,
            title: updatedData.title ? updatedData.title.trim() : mag.title,
            edition: updatedData.edition ? updatedData.edition.trim() : mag.edition,
            academicYear: updatedData.academicYear || mag.academicYear,
            coverImage: updatedData.coverImage ? updatedData.coverImage.trim() : mag.coverImage,
            publishedDate: updatedData.publishedDate || mag.publishedDate,
            editor: updatedData.editor ? updatedData.editor.trim() : mag.editor,
            pageCount: updatedData.pageCount !== undefined ? Number(updatedData.pageCount) : mag.pageCount,
            pdfUrl: updatedData.pdfUrl ? updatedData.pdfUrl.trim() : mag.pdfUrl,
            featured: updatedData.featured !== undefined ? Boolean(updatedData.featured) : mag.featured,
            description: updatedData.description !== undefined ? updatedData.description.trim() : mag.description,
            tags: updatedData.tags || mag.tags,
          };
        }
        return mag;
      })
    );
  };

  // Delete Magazine
  const deleteMagazine = (id) => {
    setMagazines((prev) => prev.filter((m) => m.id !== id));
  };

  // Increment download / read counters
  const trackDownload = (id) => {
    setMagazines((prev) =>
      prev.map((mag) => {
        if (mag.id === id) {
          return {
            ...mag,
            downloadsCount: (mag.downloadsCount || 0) + 1,
            readsCount: (mag.readsCount || 0) + 1,
          };
        }
        return mag;
      })
    );
  };

  return {
    magazines,
    filteredMagazines,
    selectedYear,
    setSelectedYear,
    searchQuery,
    setSearchQuery,
    selectedMagazine,
    setSelectedMagazine,
    viewingPdfMagazine,
    setViewingPdfMagazine,
    magazineStats,
    addMagazine,
    updateMagazine,
    deleteMagazine,
    trackDownload,
  };
}

export default useMagazines;
