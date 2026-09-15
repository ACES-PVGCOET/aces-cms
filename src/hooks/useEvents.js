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
    reg_st_dt: evt.reg_st_dt || null,
    reg_end_dt: evt.reg_end_dt || null,
    banner_url,
    isHighlight,
  };
}

const DEFAULT_EVENTS = [
  {
    id: 'evt-001',
    overview: "Dino's Leaf Party",
    description: "An exclusive tech networking mixer & gamified speed coding showdown bringing engineers together across campuses.",
    terms: 'Bring your laptop, college ID, and student credentials. Code of conduct enforced.',
    reg_form_id: 'aces-form-dino-2026',
    banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
    isHighlight: true,
  },
  {
    id: 'evt-002',
    overview: 'ACES HackNight 2026',
    description: '36-Hour continuous hackathon exploring next-generation web architectures, AI agents, and systems programming.',
    terms: 'Teams of 2 to 4 members. Hardware and cloud infrastructure credits provided.',
    reg_form_id: 'aces-form-hacknight',
    banner_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
    isHighlight: true,
  },
  {
    id: 'evt-003',
    overview: 'WebCraft Masterclass: React 19 & Tailwind 4',
    description: 'Hands-on live coding workshop building modern distributed React 19 apps with reactive design token architectures.',
    terms: 'Open to all registered computer engineering students.',
    reg_form_id: 'aces-form-webcraft',
    banner_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
    isHighlight: false,
  },
  {
    id: 'evt-004',
    overview: 'Cloud & Bare-Metal Cluster Workshop',
    description: 'Deep dive into Kubernetes bare-metal orchestration, eBPF telemetry, and high-concurrency microservices.',
    terms: 'Prerequisite: Basic Linux terminal proficiency.',
    reg_form_id: 'aces-form-cloud',
    banner_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    isHighlight: false,
  },
];

/**
 * useEvents Hook
 * Provides Event state management strictly adhering to backend Event API model with offline fallback.
 */
export function useEvents() {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightFilter, setHighlightFilter] = useState('All'); // 'All' | 'Highlighted' | 'Standard'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events from backend API on mount
  const fetchFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiData = await eventsApi.getAll();
      if (Array.isArray(apiData) && apiData.length > 0) {
        setEvents(apiData.map(normalizeEvent));
      }
    } catch (e) {
      console.warn('[Events Hook] Backend offline, using default demo events');
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
        reg_st_dt: eventData.reg_st_dt || null,
        reg_end_dt: eventData.reg_end_dt || null,
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
        reg_st_dt: updatedData.reg_st_dt !== undefined ? updatedData.reg_st_dt : undefined,
        reg_end_dt: updatedData.reg_end_dt !== undefined ? updatedData.reg_end_dt : undefined,
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
