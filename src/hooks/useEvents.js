import { useState, useEffect, useMemo, useCallback } from 'react';
import { eventsApi } from '../services/api';

function normalizeEvent(evt) {
  const overview = evt.overview || evt.title || 'ACES Session';
  const banner_url = evt.banner_url || evt.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80';
  const isHighlight = Boolean(evt.isHighlight !== undefined ? evt.isHighlight : evt.featured);

  return {
    id: evt.id || evt._id,
    overview,
    description: evt.description || '',
    terms: evt.terms || 'Standard ACES student guidelines apply.',
    reg_form_id: evt.reg_form_id || null,
    banner_url,
    isHighlight,
  };
}

/**
 * useEvents Hook
 * Provides Event state management strictly adhering to backend Event API model:
 * overview, description, terms, reg_form_id, banner_url, isHighlight.
 */
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightFilter, setHighlightFilter] = useState('All'); // 'All' | 'Highlighted' | 'Standard'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events from backend API on mount
  const fetchFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiData = await eventsApi.getAll();
      if (Array.isArray(apiData)) {
        setEvents(apiData.map(normalizeEvent));
      }
    } catch (e) {
      console.info('[Events Hook] API fetch error:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromApi();
  }, [fetchFromApi]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Highlight filter
      if (highlightFilter === 'Highlighted' && !event.isHighlight) return false;
      if (highlightFilter === 'Standard' && event.isHighlight) return false;

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesOverview = (event.overview || '').toLowerCase().includes(q);
        const matchesDesc = (event.description || '').toLowerCase().includes(q);
        const matchesTerms = (event.terms || '').toLowerCase().includes(q);
        const matchesFormId = (event.reg_form_id || '').toLowerCase().includes(q);

        return matchesOverview || matchesDesc || matchesTerms || matchesFormId;
      }

      return true;
    });
  }, [events, highlightFilter, searchQuery]);

  // Event stats
  const eventStats = useMemo(() => {
    const totalEvents = events.length;
    const highlightedCount = events.filter((e) => e.isHighlight).length;
    const formLinkedCount = events.filter((e) => Boolean(e.reg_form_id)).length;

    return {
      totalEvents,
      highlightedCount,
      formLinkedCount,
    };
  }, [events]);

  // Create Event
  const createEvent = async (eventData) => {
    setIsLoading(true);
    const overview = (eventData.overview || '').trim();
    const description = (eventData.description || '').trim();
    const terms = (eventData.terms || 'Standard ACES student guidelines apply.').trim();
    const banner_url = eventData.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80';
    const isHighlight = Boolean(eventData.isHighlight);

    try {
      const apiResult = await eventsApi.create({
        overview,
        description,
        terms,
        reg_form_id: eventData.reg_form_id || null,
        banner_url,
        isHighlight,
      });
      const finalEvent = normalizeEvent(apiResult);
      setEvents((prev) => [finalEvent, ...prev]);
      return finalEvent;
    } catch (e) {
      console.error('[Events Hook] API create event failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Event
  const updateEvent = async (id, updatedData) => {
    setIsLoading(true);
    try {
      const apiResult = await eventsApi.update(id, {
        overview: updatedData.overview !== undefined ? updatedData.overview.trim() : undefined,
        description: updatedData.description !== undefined ? updatedData.description.trim() : undefined,
        terms: updatedData.terms !== undefined ? updatedData.terms.trim() : undefined,
        reg_form_id: updatedData.reg_form_id !== undefined ? updatedData.reg_form_id : undefined,
        banner_url: updatedData.banner_url,
        isHighlight: updatedData.isHighlight !== undefined ? Boolean(updatedData.isHighlight) : undefined,
      });
      const updatedNorm = normalizeEvent(apiResult);
      setEvents((prev) => prev.map((evt) => (evt.id === id ? updatedNorm : evt)));
      return updatedNorm;
    } catch (e) {
      console.error('[Events Hook] API update event failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Event
  const deleteEvent = async (id) => {
    setIsLoading(true);
    try {
      await eventsApi.delete(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      console.error('[Events Hook] API delete event failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Highlight Spotlight
  const toggleHighlight = async (id) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;
    try {
      await updateEvent(id, { ...target, isHighlight: !target.isHighlight });
    } catch (e) {
      console.error('[Events Hook] Toggle highlight failed:', e.message);
    }
  };

  return {
    events,
    filteredEvents,
    searchQuery,
    setSearchQuery,
    highlightFilter,
    setHighlightFilter,
    viewMode,
    setViewMode,
    eventStats,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleHighlight,
    isLoading,
    refreshEvents: fetchFromApi,
  };
}

export default useEvents;
