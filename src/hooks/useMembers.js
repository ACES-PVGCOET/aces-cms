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

const DEFAULT_MEMBERS = [
  {
    id: 'mem-001',
    name: 'Dr. Sunita Kulkarni',
    email: 'sunita.kulkarni@pvgcoet.ac.in',
    team: 'Faculty',
    position: 'Faculty Sponsor',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: '', instagram: '' },
  },
  {
    id: 'mem-002',
    name: 'Yash Jawle',
    email: 'yashjawle440@gmail.com',
    team: 'Leaders',
    position: 'President',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: 'https://github.com', instagram: 'https://instagram.com' },
  },
  {
    id: 'mem-003',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@acesclub.org',
    team: 'Leaders',
    position: 'Vice President',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: 'https://github.com', instagram: 'https://instagram.com' },
  },
  {
    id: 'mem-004',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@acesclub.org',
    team: 'Technical Team',
    position: 'Tech Lead',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: 'https://github.com', instagram: '' },
  },
  {
    id: 'mem-005',
    name: 'Diya Patel',
    email: 'diya.patel@acesclub.org',
    team: 'Web Team',
    position: 'Lead Web Engineer',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: 'https://github.com', instagram: 'https://instagram.com' },
  },
  {
    id: 'mem-006',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@acesclub.org',
    team: 'Editorial Team',
    position: 'Editorial Lead',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: '', instagram: 'https://instagram.com' },
  },
  {
    id: 'mem-007',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@acesclub.org',
    team: 'Design & Production',
    position: 'Creative Director',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: '', instagram: 'https://instagram.com' },
  },
  {
    id: 'mem-008',
    name: 'Priya Shinde',
    email: 'priya.shinde@acesclub.org',
    team: 'Marketing Team',
    position: 'Marketing Head',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: '', instagram: 'https://instagram.com' },
  },
  {
    id: 'mem-009',
    name: 'Tanmay Kulkarni',
    email: 'tanmay.kulkarni@acesclub.org',
    team: 'Media Team',
    position: 'Media Head',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: '', instagram: 'https://instagram.com' },
  },
  {
    id: 'mem-010',
    name: 'Pooja Verma',
    email: 'pooja.verma@acesclub.org',
    team: 'Event Team',
    position: 'Event Coordinator',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: '', instagram: 'https://instagram.com' },
  },
  {
    id: 'mem-011',
    name: 'Varun Nair',
    email: 'varun.nair@acesclub.org',
    team: 'Treasury Team',
    position: 'Treasurer',
    status: 'ACTIVE',
    profile_photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    social_links: { linkedin: 'https://linkedin.com', github: '', instagram: 'https://instagram.com' },
  },
];

/**
 * useMembers Hook
 * Fetches real member records directly from backend API (/iam/members) with rich offline fallback.
 */
export function useMembers() {
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch members from backend API on mount
  const fetchFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiData = await membersApi.getAll();
      if (Array.isArray(apiData) && apiData.length > 0) {
        setMembers(apiData.map(normalizeMember));
      }
    } catch (e) {
      console.warn('[Members Hook] Backend offline, using default demo members');
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
