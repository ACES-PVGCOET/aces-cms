import { useMemo } from 'react';

/**
 * useStats Hook
 * Computes reactive aggregated statistics across members, events, and teams.
 */
export function useStats(members = [], events = []) {
  return useMemo(() => {
    // Total / Active Members count
    const activeMembersCount = members.filter((m) => m.status === 'Active').length || members.length;
    
    // Active Events (Scheduled or Live)
    const eventsInMotionCount = events.filter((e) => e.status === 'Scheduled' || e.status === 'Live').length;
    
    // Unique Teams
    const teams = new Set(members.map((m) => m.team).filter(Boolean));
    const teamsCount = teams.size || 6;

    // Spotlight event (featured or first upcoming)
    const spotlightEvent = events.find((e) => e.featured) || events[0];

    return {
      activeMembersCount,
      eventsInMotionCount,
      teamsCount,
      spotlightEvent,
    };
  }, [members, events]);
}
