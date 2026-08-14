import { useState, useEffect, useMemo } from 'react';
import { INITIAL_EVENTS } from '../data/mockData';

const STORAGE_KEY = 'aces_cms_events_data';

/**
 * useEvents Hook
 * Provides plug-and-play Event state management, status/mode filtering,
 * search querying, and CRUD operations.
 */
export function useEvents() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load events from localStorage', e);
    }
    return INITIAL_EVENTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [modeFilter, setModeFilter] = useState('All Modes');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isLoading, setIsLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to save events to localStorage', e);
    }
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Status filter
      if (statusFilter !== 'All Statuses' && event.status !== statusFilter) {
        return false;
      }

      // Mode filter
      if (modeFilter !== 'All Modes' && event.mode !== modeFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesDesc = event.description.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesTeam = event.organizerTeam?.toLowerCase().includes(q);
        const matchesTags = event.tags?.some((t) => t.toLowerCase().includes(q));

        return matchesTitle || matchesDesc || matchesVenue || matchesTeam || matchesTags;
      }

      return true;
    });
  }, [events, statusFilter, modeFilter, searchQuery]);

  // Event stats
  const eventStats = useMemo(() => {
    const totalEvents = events.length;
    const upcomingSessions = events.filter((e) => e.status === 'Scheduled' || e.status === 'Live').length;
    const recentlyCompleted = events.filter((e) => e.status === 'Completed').length;

    return {
      totalEvents,
      upcomingSessions: `${upcomingSessions} Active`,
      recentlyCompleted: `${recentlyCompleted} Archived`,
    };
  }, [events]);

  // Create Event
  const createEvent = (eventData) => {
    setIsLoading(true);
    const newEvent = {
      id: `aces-evt-${Date.now().toString().slice(-4)}`,
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '4:00 PM - 6:00 PM',
      mode: eventData.mode || 'Offline',
      status: eventData.status || 'Scheduled',
      venue: eventData.venue?.trim() || 'ACES Auditorium',
      attendeesCount: Number(eventData.attendeesCount) || 0,
      capacity: Number(eventData.capacity) || 100,
      banner:
        eventData.banner?.trim() ||
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      organizerTeam: eventData.organizerTeam || 'Web Team',
      tags: eventData.tags || ['ACES', 'Tech'],
      featured: Boolean(eventData.featured),
    };

    setEvents((prev) => [newEvent, ...prev]);
    setIsLoading(false);
    return newEvent;
  };

  // Update Event
  const updateEvent = (id, updatedData) => {
    setIsLoading(true);
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          return {
            ...evt,
            ...updatedData,
            title: updatedData.title !== undefined ? updatedData.title.trim() : evt.title,
            description: updatedData.description !== undefined ? updatedData.description.trim() : evt.description,
            venue: updatedData.venue !== undefined ? updatedData.venue.trim() : evt.venue,
            attendeesCount: updatedData.attendeesCount !== undefined ? Number(updatedData.attendeesCount) : evt.attendeesCount,
            capacity: updatedData.capacity !== undefined ? Number(updatedData.capacity) : evt.capacity,
          };
        }
        return evt;
      })
    );
    setIsLoading(false);
  };

  // Delete Event
  const deleteEvent = (id) => {
    setIsLoading(true);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setIsLoading(false);
  };

  // Toggle Featured Spotlight
  const toggleFeatured = (id) => {
    setEvents((prev) =>
      prev.map((e) => ({
        ...e,
        featured: e.id === id ? !e.featured : false,
      }))
    );
  };

  // Reset to default
  const resetEventsData = () => {
    setEvents(INITIAL_EVENTS);
  };

  return {
    events,
    filteredEvents,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    modeFilter,
    setModeFilter,
    viewMode,
    setViewMode,
    eventStats,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleFeatured,
    resetEventsData,
    isLoading,
  };
}
