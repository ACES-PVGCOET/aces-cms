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
  UserCog, 
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import StatCard from './StatCard';
import { membersApi } from '../services/api';
import { LinkedinIcon, GithubIcon, InstagramIcon, GlobeIcon } from './SocialIcons';

const AVAILABLE_ROLES = [
  { id: 'admin', label: 'True Admin', color: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/40' },
  { id: 'team_admin', label: 'Team Admin', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40' },
  { id: 'web_team', label: 'Web Team', color: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/40' },
  { id: 'tech_team', label: 'Tech Team', color: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/40' },
  { id: 'media_team', label: 'Media Team', color: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/40' },
  { id: 'marketing_team', label: 'Marketing Team', color: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/40' },
  { id: 'treasury_team', label: 'Treasury Team', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40' },
  { id: 'event_team', label: 'Event Team', color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40' },
  { id: 'editorial_team', label: 'Editorial Team', color: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/40' },
  { id: 'design_team', label: 'Design Team', color: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/40' },
  { id: 'production_team', label: 'Production Team', color: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/40' },
  { id: 'leader', label: 'Leader', color: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/40' },
  { id: 'faculty', label: 'Faculty', color: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/40' },
];

export function AdminPanelView({
  members = [],
  isTrueAdmin = false,
  onUpdateMember,
  onNavigateBack,
  showToast,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [updatingMemberId, setUpdatingMemberId] = useState(null);

  // If user is not true admin, block access completely
  if (!isTrueAdmin) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center max-w-xl mx-auto my-12 space-y-4 border border-rose-500/30">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/40">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-rose-600 dark:text-rose-400">Access Restricted</h2>
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
        {onNavigateBack && (
          <div className="pt-4">
            <button
              onClick={() => onNavigateBack('members')}
              className="px-4 py-2 rounded-xl btn-secondary text-xs font-bold"
            >
              Back to Member Hub
            </button>
          </div>
        )}
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
    <div className="space-y-6 animate-in fade-in duration-300 text-slate-900 dark:text-white">
      
      {/* 1. Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {onNavigateBack && (
              <button
                onClick={() => onNavigateBack('members')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold btn-secondary hover:bg-purple-100 transition-colors"
                title="Return to Member Directory"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-black bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
              True Admin Zone
            </span>
            <span className="text-xs leading-4 font-black btn-secondary px-2.5 py-0.5 rounded-md text-slate-800 dark:text-white">
              {filteredMembers.length} member profiles
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-black tracking-tight mt-1 flex items-center gap-3 text-slate-900 dark:text-white">
            <UserCog className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span>Admin Governance Panel</span>
          </h1>
          <p className="text-sm leading-5 text-slate-600 dark:text-slate-300 font-medium">
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
            icon={<ShieldCheck className="w-5 h-5 text-red-500 dark:text-red-400" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Team Admins"
            value={teamAdmins}
            description="Team-level member managers"
            icon={<Shield className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Active Members"
            value={activeMembers}
            description="Activated & onboarded"
            icon={<UserCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <StatCard
            title="Pending Activation"
            value={pendingMembers}
            description="Onboarding link pending"
            icon={<UserX className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
          />
        </div>
      </div>

      {/* 3. Toolbar: Search & Team Filter */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/30">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-600 dark:text-purple-400 opacity-80" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member by name, email, team or position..."
            className="w-full pl-9 pr-8 py-2 text-sm leading-5 glass-input rounded-xl placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none transition-all duration-300 font-bold"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-80 hover:opacity-100 font-black cursor-pointer px-1"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <label className="text-xs font-bold shrink-0 text-slate-700 dark:text-slate-300">Guild Filter:</label>
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl btn-secondary text-xs font-black focus:outline-none cursor-pointer border border-purple-200/80 dark:border-slate-700"
          >
            <option value="ALL" className="bg-white dark:bg-slate-900">All Guilds ({members.length})</option>
            {teamsList.map((t) => (
              <option key={t} value={t} className="bg-white dark:bg-slate-900">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Responsive Members Governance Grid (Fluid, No Broken Scrollbars) */}
      <div className="space-y-4">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredMembers.map((member) => {
              const isUpdating = updatingMemberId === member.id;
              const isMemberTrueAdmin = member.roles?.includes('admin');
              const isMemberTeamAdmin = member.roles?.includes('team_admin');
              const socials = member.social_links || member.socials || {};

              return (
                <div
                  key={member.id}
                  className="glass-card rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:border-purple-500/40 space-y-3.5 bg-white/95 dark:bg-slate-900/90 border border-purple-100 dark:border-purple-900/30 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    
                    {/* Member Details */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={member.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.email)}`}
                        alt={member.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-purple-100 dark:border-white/10 shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-base truncate text-slate-900 dark:text-white">
                            {member.name || 'Unnamed Recruit'}
                          </h3>
                          {isMemberTrueAdmin && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900/50 shrink-0">
                              True Admin
                            </span>
                          )}
                          {isMemberTeamAdmin && !isMemberTrueAdmin && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 shrink-0">
                              Team Admin
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-0.5 font-medium">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{member.email}</span>
                          <span>•</span>
                          <span className="font-bold text-purple-700 dark:text-purple-400">{member.team}</span>
                          <span>•</span>
                          <span>{member.position}</span>
                        </div>
                      </div>
                    </div>

                    {/* Official Social Links & Status Switch Primitive */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      
                      {/* Official Social Icons */}
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-purple-50/60 dark:bg-slate-800/60 border border-purple-100 dark:border-slate-700">
                        {socials.linkedin ? (
                          <a
                            href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-[#0A66C2] hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95"
                            title="Official LinkedIn Profile"
                          >
                            <LinkedinIcon className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="p-1.5 opacity-25 text-slate-400" title="No LinkedIn configured">
                            <LinkedinIcon className="w-4 h-4" />
                          </span>
                        )}

                        {socials.github ? (
                          <a
                            href={socials.github.startsWith('http') ? socials.github : `https://github.com/${socials.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95"
                            title="Official GitHub Profile"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="p-1.5 opacity-25 text-slate-400" title="No GitHub configured">
                            <GithubIcon className="w-4 h-4" />
                          </span>
                        )}

                        {socials.instagram ? (
                          <a
                            href={socials.instagram.startsWith('http') ? socials.instagram : `https://instagram.com/${socials.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-[#E4405F] hover:bg-white dark:hover:bg-slate-700 transition-all active:scale-95"
                            title="Official Instagram Profile"
                          >
                            <InstagramIcon className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="p-1.5 opacity-25 text-slate-400" title="No Instagram configured">
                            <InstagramIcon className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      {/* Account Status Switch Button */}
                      <button
                        onClick={() => handleToggleStatus(member)}
                        disabled={isUpdating}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer border shadow-2xs ${
                          member.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle member active status"
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
                  <div className="pt-2.5 border-t border-purple-100 dark:border-slate-800">
                    <div className="text-[10px] font-black uppercase tracking-wider mb-1.5 text-slate-500 dark:text-slate-400">
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
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                              hasRole
                                ? `${role.color} shadow-xs font-extrabold ring-1 ring-purple-300 dark:ring-purple-700 scale-[1.02]`
                                : 'bg-purple-50/50 hover:bg-purple-100/80 border-purple-100 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
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
          <div className="glass-panel rounded-2xl text-center py-12 space-y-3">
            <Users className="w-10 h-10 opacity-40 mx-auto text-purple-600" />
            <p className="text-sm font-bold opacity-80">No member accounts match your current query or guild filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminPanelView;
