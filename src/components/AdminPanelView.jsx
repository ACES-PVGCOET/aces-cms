import { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Check, 
  X, 
  RefreshCw,
  Lock,
  UserCog
} from 'lucide-react';
import StatCard from './StatCard';
import { membersApi } from '../services/api';

const AVAILABLE_ROLES = [
  { id: 'admin', label: 'True Admin', color: 'bg-red-500/20 text-red-300 border-red-500/40' },
  { id: 'team_admin', label: 'Team Admin', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'web_team', label: 'Web Team', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
  { id: 'tech_team', label: 'Tech Team', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
  { id: 'media_team', label: 'Media Team', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { id: 'marketing_team', label: 'Marketing Team', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
  { id: 'treasury_team', label: 'Treasury Team', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { id: 'event_team', label: 'Event Team', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { id: 'editorial_team', label: 'Editorial Team', color: 'bg-violet-500/20 text-violet-300 border-violet-500/40' },
  { id: 'design_team', label: 'Design Team', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40' },
  { id: 'production_team', label: 'Production Team', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
  { id: 'leader', label: 'Leader', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' },
  { id: 'faculty', label: 'Faculty', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
];

export function AdminPanelView({
  members = [],
  isTrueAdmin = false,
  onUpdateMember,
  showToast,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [updatingMemberId, setUpdatingMemberId] = useState(null);

  // If user is not true admin, block access completely
  if (!isTrueAdmin) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto my-12 space-y-4 border border-rose-500/30">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-rose-400">Access Restricted</h2>
          <p className="text-sm opacity-80 mt-2 font-medium">
            The Admin Panel is reserved strictly for True System Administrators.
          </p>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 opacity-70">
            <Lock className="w-3.5 h-3.5" />
            <span>Role Requirement: admin</span>
          </span>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalMembers = members.length;
  const trueAdmins = members.filter((m) => m.roles?.includes('admin')).length;
  const teamAdmins = members.filter((m) => m.roles?.includes('team_admin')).length;
  const activeMembers = members.filter((m) => m.status === 'ACTIVE').length;
  const pendingMembers = members.filter((m) => m.status === 'NOT_ACTIVE').length;

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      (m.name && m.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.team && m.team.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.position && m.position.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTeam = 
      selectedTeamFilter === 'ALL' || 
      (m.team && m.team.toLowerCase() === selectedTeamFilter.toLowerCase());

    return matchesSearch && matchesTeam;
  });

  const teamsList = Array.from(new Set(members.map((m) => m.team).filter(Boolean)));

  // Role toggle handler
  const handleToggleRole = async (member, roleId) => {
    setUpdatingMemberId(member.id);
    const currentRoles = Array.isArray(member.roles) ? [...member.roles] : [];
    let updatedRoles;

    if (currentRoles.includes(roleId)) {
      updatedRoles = currentRoles.filter((r) => r !== roleId);
    } else {
      updatedRoles = [...currentRoles, roleId];
    }

    try {
      const updated = await membersApi.updateProfile(member.id, { roles: updatedRoles });
      if (onUpdateMember) {
        onUpdateMember(member.id, { roles: updatedRoles, ...updated });
      }
      if (showToast) {
        showToast(
          `Roles for ${member.name || member.email} updated successfully.`,
          'success',
          'Roles Updated'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to update member roles.', 'error', 'Update Failed');
      }
    } finally {
      setUpdatingMemberId(null);
    }
  };

  // Status toggle handler
  const handleToggleStatus = async (member) => {
    setUpdatingMemberId(member.id);
    const newStatus = member.status === 'ACTIVE' ? 'NOT_ACTIVE' : 'ACTIVE';

    try {
      const updated = await membersApi.updateProfile(member.id, { status: newStatus });
      if (onUpdateMember) {
        onUpdateMember(member.id, { status: newStatus, ...updated });
      }
      if (showToast) {
        showToast(
          `Status for ${member.name || member.email} changed to ${newStatus}.`,
          'success',
          'Status Changed'
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Failed to update member status.', 'error', 'Update Failed');
      }
    } finally {
      setUpdatingMemberId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              True Admin Zone
            </span>
            <span className="text-xs leading-4 font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              {filteredMembers.length} member profiles
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-extrabold tracking-tight mt-1 flex items-center gap-3">
            <UserCog className="w-8 h-8 text-indigo-400" />
            <span>Admin Governance Panel</span>
          </h1>
          <p className="text-sm leading-5 opacity-70 font-medium">
            Manage system roles, grant team-admin privileges, and control account activation statuses across all ACES members.
          </p>
        </div>
      </div>

      {/* 2. Key Statistics Cards Grid */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="True System Admins"
            value={trueAdmins}
            description="Full system governance"
            icon={<ShieldCheck className="w-5 h-5 text-red-400" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Team Admins"
            value={teamAdmins}
            description="Team-level member managers"
            icon={<Shield className="w-5 h-5 text-amber-400" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Active Members"
            value={activeMembers}
            description="Activated & onboarded"
            icon={<UserCheck className="w-5 h-5 text-emerald-400" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Pending Activation"
            value={pendingMembers}
            description="Onboarding link pending"
            icon={<UserX className="w-5 h-5 text-yellow-400" />}
          />
        </div>
      </div>

      {/* 3. Toolbar: Search & Team Filter */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member by name, email, team or position..."
            className="w-full pl-9 pr-8 py-2 text-sm leading-5 glass-input rounded-lg placeholder-slate-400 focus:outline-none transition-all duration-300 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <label className="text-xs opacity-70 font-semibold shrink-0">Guild Filter:</label>
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg btn-secondary text-sm font-bold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Guilds ({members.length})</option>
            {teamsList.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Members Governance Table / Cards */}
      <div className="glass-panel rounded-2xl p-3 sm:p-6 shadow-sm overflow-x-auto no-scrollbar">
        {filteredMembers.length > 0 ? (
          <div className="space-y-4 min-w-[720px]">
            {filteredMembers.map((member) => {
              const isUpdating = updatingMemberId === member.id;
              const isMemberTrueAdmin = member.roles?.includes('admin');
              const isMemberTeamAdmin = member.roles?.includes('team_admin');

              return (
                <div
                  key={member.id}
                  className="glass-card rounded-xl p-4 transition-all duration-200 hover:border-indigo-500/40 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    
                    {/* Member Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={member.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.email)}`}
                        alt={member.name}
                        className="w-11 h-11 rounded-full object-cover border border-white/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base truncate">{member.name || 'Unnamed Recruit'}</h3>
                          {isMemberTrueAdmin && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 shrink-0">
                              Admin
                            </span>
                          )}
                          {isMemberTeamAdmin && !isMemberTrueAdmin && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                              Team Admin
                            </span>
                          )}
                        </div>
                        <div className="text-xs opacity-70 flex flex-wrap items-center gap-2 mt-0.5 font-medium">
                          <span>{member.email}</span>
                          <span>•</span>
                          <span className="font-bold text-indigo-400">{member.team}</span>
                          <span>•</span>
                          <span>{member.position}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Switch Primitive */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleToggleStatus(member)}
                        disabled={isUpdating}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border ${
                          member.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                      >
                        {isUpdating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : member.status === 'ACTIVE' ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                        <span>{member.status === 'ACTIVE' ? 'ACTIVE' : 'NOT ACTIVE'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Role Badges Selection Bar */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[11px] font-bold opacity-60 uppercase tracking-wider mb-2">
                      Assign / Revoke Member Roles:
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {AVAILABLE_ROLES.map((role) => {
                        const hasRole = member.roles?.includes(role.id);
                        return (
                          <button
                            key={role.id}
                            onClick={() => handleToggleRole(member, role.id)}
                            disabled={isUpdating}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                              hasRole
                                ? `${role.color} shadow-xs font-extrabold ring-1 ring-white/20 scale-[1.02]`
                                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {hasRole && <Check className="w-3 h-3 shrink-0" />}
                            <span>{role.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <Users className="w-10 h-10 opacity-40 mx-auto" />
            <p className="text-sm font-semibold opacity-70">No member accounts match your current query or guild filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminPanelView;
