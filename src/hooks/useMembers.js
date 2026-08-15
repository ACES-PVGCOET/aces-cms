import { useState, useEffect, useMemo, useCallback } from 'react';
import { membersApi } from '../services/api';

function normalizeMember(m) {
  return {
    id: m.id || m._id,
    name: m.name || '',
    email: m.email || '',
    team: m.team || 'Web Team',
    position: m.position || m.role || 'Member',
    status: m.status || 'ACTIVE',
    roles: Array.isArray(m.roles) ? m.roles : [],
    profile_photo_url: m.profile_photo_url || m.avatar || '',
    social_links: {
      linkedin: m.social_links?.linkedin || m.socials?.linkedin || '',
      instagram: m.social_links?.instagram || m.socials?.instagram || '',
      github: m.social_links?.github || m.socials?.github || '',
    },
  };
}

/**
 * useMembers Hook
 * Fetches real member records directly from backend API (/iam/members).
 */
export function useMembers() {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch members from backend API on mount
  const fetchFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiData = await membersApi.getAll();
      if (Array.isArray(apiData)) {
        setMembers(apiData.map(normalizeMember));
      }
    } catch (e) {
      console.warn('[Members Hook] API fetch members error:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromApi();
  }, [fetchFromApi]);

  // Filtered and sorted members list
  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        // Team filter
        if (selectedTeam !== 'All Teams' && member.team !== selectedTeam) {
          return false;
        }

        // Search query filter (name, position, email, team, roles)
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = (member.name || '').toLowerCase().includes(q);
          const matchesPosition = (member.position || '').toLowerCase().includes(q);
          const matchesEmail = (member.email || '').toLowerCase().includes(q);
          const matchesTeam = (member.team || '').toLowerCase().includes(q);
          const matchesRoles = member.roles?.some((r) => r.toLowerCase().includes(q));

          return matchesName || matchesPosition || matchesEmail || matchesTeam || matchesRoles;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return (a.name || a.email).localeCompare(b.name || b.email);
        }
        if (sortBy === 'name-desc') {
          return (b.name || b.email).localeCompare(a.name || a.email);
        }
        if (sortBy === 'team') {
          return (a.team || '').localeCompare(b.team || '');
        }
        return 0;
      });
  }, [members, selectedTeam, searchQuery, sortBy]);

  // Statistics calculation for Members view
  const memberStats = useMemo(() => {
    const totalMembers = members.length;
    
    // Unique teams with members
    const uniqueTeams = new Set(members.map((m) => m.team).filter(Boolean)).size;
    
    // Socials pending (missing either linkedin or instagram)
    const socialsPending = members.filter(
      (m) => !m.social_links?.linkedin || !m.social_links?.instagram
    ).length;

    return {
      totalMembers,
      teamsTracking: `${uniqueTeams} Active Guilds`,
      socialsPending: `${socialsPending} Needs Links`,
    };
  }, [members]);

  // Add Member
  const addMember = async (newMemberData) => {
    setIsLoading(true);
    try {
      const apiResult = await membersApi.register(newMemberData);
      const added = normalizeMember(apiResult);
      setMembers((prev) => [added, ...prev]);
      return added;
    } catch (e) {
      console.error('[Members Hook] API register member failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Member
  const updateMember = async (id, updatedData) => {
    setIsLoading(true);
    try {
      const apiResult = await membersApi.updateProfile(id, updatedData);
      const updatedNorm = normalizeMember(apiResult);
      setMembers((prev) => prev.map((mem) => (mem.id === id ? updatedNorm : mem)));
      return updatedNorm;
    } catch (e) {
      console.error('[Members Hook] API update member failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Member
  const deleteMember = async (id) => {
    setIsLoading(true);
    try {
      await membersApi.delete(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error('[Members Hook] API delete member failed:', e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    members,
    filteredMembers,
    searchQuery,
    setSearchQuery,
    selectedTeam,
    setSelectedTeam,
    sortBy,
    setSortBy,
    memberStats,
    addMember,
    updateMember,
    deleteMember,
    isLoading,
    refreshMembers: fetchFromApi,
  };
}

export default useMembers;
