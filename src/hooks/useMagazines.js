import { useState, useEffect, useMemo, useCallback } from 'react';
import { galleryApi } from '../services/api';

const DEFAULT_MAGAZINES = [
  {
    id: 'aces-mag-2026-01',
    title: 'ACES ByteCraft Vol 12: The GenAI Frontier',
    edition: 'Volume 12, Issue 1',
    academicYear: '2026-27',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    publishedDate: '2026-04-15',
    editor: 'Ananya Deshmukh (Editorial Lead)',
    pageCount: 64,
    downloadsCount: 1420,
    readsCount: 3850,
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    featured: true,
    description: 'Comprehensive annual technical publication highlighting breakthroughs in generative AI, system architecture, and campus projects.',
    tags: ['GenAI', 'Tech', 'Annual', '2026-27'],
  },
];

function normalizeMagazine(item) {
  let meta = {};
  if (item.caption) {
    try {
      meta = JSON.parse(item.caption);
    } catch (_e) {
      meta = { description: item.caption };
    }
  }

  return {
    id: item.id || item._id,
    title: item.title || 'ACES ByteCraft Edition',
    edition: meta.edition || 'Volume 12, Issue 1',
    academicYear: meta.academicYear || '2026-27',
    coverImage: item.media_url || meta.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    publishedDate: meta.publishedDate || new Date().toISOString().split('T')[0],
    editor: meta.editor || 'ACES Editorial Guild',
    pageCount: meta.pageCount || 50,
    downloadsCount: meta.downloadsCount || 0,
    readsCount: meta.readsCount || 0,
    pdfUrl: meta.pdfUrl || 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    featured: Boolean(meta.featured),
    description: meta.description || 'ACES club technical publication.',
    tags: meta.tags || ['ACES', 'Publication'],
  };
}

/**
 * useMagazines Hook
 * Provides state management, academic year filtering, search filtering,
 * and CRUD operations connected directly to API (collection_name="Magazines").
 */
export function useMagazines() {
  const [magazines, setMagazines] = useState(DEFAULT_MAGAZINES);
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [viewingPdfMagazine, setViewingPdfMagazine] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch magazines from backend API on mount
  const fetchFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiItems = await galleryApi.getItems({ collection_name: 'Magazines' });
      if (Array.isArray(apiItems) && apiItems.length > 0) {
        setMagazines(apiItems.map(normalizeMagazine));
      }
    } catch (e) {
      console.info('[Magazines Hook] API fetch warning:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromApi();
  }, [fetchFromApi]);

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
  const addMagazine = async (newMagData) => {
    setIsLoading(true);
    const title = newMagData.title.trim();
    const coverImage =
      newMagData.coverImage?.trim() ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';

    const metadataPayload = {
      edition: newMagData.edition?.trim() || 'Volume 12, Issue 1',
      academicYear: newMagData.academicYear || '2026-27',
      publishedDate: newMagData.publishedDate || new Date().toISOString().split('T')[0],
      editor: newMagData.editor?.trim() || 'ACES Editorial Team',
      pageCount: Number(newMagData.pageCount) || 50,
      downloadsCount: 0,
      readsCount: 0,
      pdfUrl:
        newMagData.pdfUrl?.trim() ||
        'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
      featured: Boolean(newMagData.featured),
      description: newMagData.description?.trim() || 'Official ACES club publication.',
      tags: newMagData.tags || ['ACES', 'Publication'],
      coverImage,
    };

    try {
      const apiResult = await galleryApi.createItem({
        title,
        caption: JSON.stringify(metadataPayload),
        media_url: coverImage,
        media_type: 'image',
        collection_name: 'Magazines',
      });
      const newMag = normalizeMagazine(apiResult);
      setMagazines((prev) => [newMag, ...prev]);
      return newMag;
    } catch (e) {
      console.error('[Magazines Hook] API add magazine failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Magazine Edition
  const updateMagazine = async (id, updatedData) => {
    setIsLoading(true);
    const existing = magazines.find((m) => m.id === id);
    if (!existing) return;

    const merged = { ...existing, ...updatedData };
    const metadataPayload = {
      edition: merged.edition,
      academicYear: merged.academicYear,
      publishedDate: merged.publishedDate,
      editor: merged.editor,
      pageCount: merged.pageCount,
      downloadsCount: merged.downloadsCount,
      readsCount: merged.readsCount,
      pdfUrl: merged.pdfUrl,
      featured: merged.featured,
      description: merged.description,
      tags: merged.tags,
      coverImage: merged.coverImage,
    };

    try {
      const apiResult = await galleryApi.updateItem(id, {
        title: merged.title,
        caption: JSON.stringify(metadataPayload),
        media_url: merged.coverImage,
        collection_name: 'Magazines',
      });
      const updated = normalizeMagazine(apiResult);
      setMagazines((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (e) {
      console.error('[Magazines Hook] API update magazine failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Magazine
  const deleteMagazine = async (id) => {
    setIsLoading(true);
    try {
      await galleryApi.deleteItem(id);
      setMagazines((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error('[Magazines Hook] API delete magazine failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
    refreshMagazines: fetchFromApi,
  };
}

export default useMagazines;
