import { useState, useEffect, useMemo } from 'react';
import { INITIAL_MEMBERS } from '../data/mockData';

const STORAGE_KEY = 'aces_cms_members_data';

/**
 * useMembers Hook
 * Provides plug-and-play Member state management, search filtering,
 * team tab categorization, and CRUD operations.
 * Future backend integration: Replace localStorage with axios/fetch calls.
 */
export function useMembers() {
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load members from localStorage', e);
    }
    return INITIAL_MEMBERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (e) {
      console.warn('Failed to save members to localStorage', e);
    }
  }, [members]);

  // Filtered and sorted members list
  const filteredMembers = useMemo(() => {
    return members
      .filter((member) => {
        // Team filter
        if (selectedTeam !== 'All Teams' && member.team !== selectedTeam) {
          return false;
        }

        // Search query filter (name, role, email, team, skills)
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = member.name.toLowerCase().includes(q);
          const matchesRole = member.role.toLowerCase().includes(q);
          const matchesEmail = member.email.toLowerCase().includes(q);
          const matchesTeam = member.team.toLowerCase().includes(q);
          const matchesSkills = member.skills?.some((s) => s.toLowerCase().includes(q));

          return matchesName || matchesRole || matchesEmail || matchesTeam || matchesSkills;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'name-desc') {
          return b.name.localeCompare(a.name);
        }
        if (sortBy === 'team') {
          return a.team.localeCompare(b.team);
        }
        if (sortBy === 'newest') {
          return new Date(b.joinedDate || 0) - new Date(a.joinedDate || 0);
        }
        return 0;
      });
  }, [members, selectedTeam, searchQuery, sortBy]);

  // Statistics calculation for Members view
  const memberStats = useMemo(() => {
    const totalMembers = members.length;
    
    // Unique teams with members
    const uniqueTeams = new Set(members.map((m) => m.team)).size;
    
    // Socials pending (missing either linkedin or instagram)
    const socialsPending = members.filter(
      (m) => !m.socials?.linkedin || !m.socials?.instagram
    ).length;

    return {
      totalMembers,
      teamsTracking: `${uniqueTeams} Active Guilds`,
      socialsPending: `${socialsPending} Needs Links`,
    };
  }, [members]);

  // Add Member
  const addMember = (newMemberData) => {
    setIsLoading(true);
    const newMember = {
      id: `aces-mem-${Date.now().toString().slice(-4)}`,
      name: newMemberData.name.trim(),
      role: newMemberData.role.trim(),
      email: newMemberData.email.trim(),
      team: newMemberData.team || 'Web Team',
      avatar:
        newMemberData.avatar?.trim() ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newMemberData.name)}`,
      socials: {
        instagram: newMemberData.instagram?.trim() || '',
        linkedin: newMemberData.linkedin?.trim() || '',
        github: newMemberData.github?.trim() || '',
      },
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      bio: newMemberData.bio?.trim() || 'ACES Club member passionate about engineering and technology.',
      skills: newMemberData.skills || ['Engineering', 'Collaboration'],
    };

    setMembers((prev) => [newMember, ...prev]);
    setIsLoading(false);
    return newMember;
  };

  // Update Member
  const updateMember = (id, updatedData) => {
    setIsLoading(true);
    setMembers((prev) =>
      prev.map((mem) => {
        if (mem.id === id) {
          return {
            ...mem,
            name: updatedData.name ? updatedData.name.trim() : mem.name,
            role: updatedData.role ? updatedData.role.trim() : mem.role,
            email: updatedData.email ? updatedData.email.trim() : mem.email,
            team: updatedData.team || mem.team,
            avatar: updatedData.avatar ? updatedData.avatar.trim() : mem.avatar,
            socials: {
              instagram: updatedData.instagram !== undefined ? updatedData.instagram.trim() : mem.socials.instagram,
              linkedin: updatedData.linkedin !== undefined ? updatedData.linkedin.trim() : mem.socials.linkedin,
              github: updatedData.github !== undefined ? updatedData.github.trim() : mem.socials.github,
            },
            bio: updatedData.bio !== undefined ? updatedData.bio.trim() : mem.bio,
            skills: updatedData.skills || mem.skills,
          };
        }
        return mem;
      })
    );
    setIsLoading(false);
  };

  // Delete Member
  const deleteMember = (id) => {
    setIsLoading(true);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setIsLoading(false);
  };

  // Reset to default mock data
  const resetMembersData = () => {
    setMembers(INITIAL_MEMBERS);
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
    resetMembersData,
    isLoading,
  };
}
