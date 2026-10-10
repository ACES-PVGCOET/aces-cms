import { useState } from 'react';
import { 
  Users, 
  Layers, 
  Plus, 
  Search, 
  ArrowUpDown,
  FileSpreadsheet,
  ShieldCheck,
  LayoutList,
  LayoutGrid,
  AlertTriangle,
  Image as ImageIcon,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import StatCard from './StatCard';
import MemberCard from './MemberCard';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import Pagination from './Pagination';

/**
 * MembersView Component
 * Multi-Theme Member directory adhering strictly to semantic design tokens.
 */
export function MembersView({
  members = [],
  filteredMembers = [],
  paginatedMembers,
  page = 1,
  onPageChange,
  pageSize = 12,
  onPageSizeChange,
  totalPages = 1,
  totalCount,
  searchQuery,
  onSearchChange,
  selectedTeam,
  onSelectTeam,
  sortBy,
  onSortChange,
  memberStats = {},
  onOpenAddMember,
  onOpenBatchRegister,
  onOpenAdminPanel,
  isTrueAdmin = false,
  onViewMember,
  onEditMember,
  onDeleteMember,
  allowAdd = true,
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const itemsToDisplay = paginatedMembers || (onPageChange ? filteredMembers.slice((page - 1) * pageSize, page * pageSize) : filteredMembers);
  const TEAMS_LIST = [
    'All Teams',
    'Faculty',
    'Leaders',
    'Technical Team',
    'Web Team',
    'Editorial Team',
    'Design & Production',
    'Marketing Team',
    'Media Team',
    'Event Team',
    'Treasury Team',
  ];

  const getTeamCount = (team) => {
    if (team === 'All Teams') return members.length;
    return members.filter((m) => m.team === team).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-black dark:text-white">
      
      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-black tracking-tight text-black dark:text-white">
            <span className="classic-dotted-heading">Committee</span>
          </h1>
          <p className="text-sm leading-5 text-black dark:text-white opacity-80 font-semibold mt-1">
            Discover engineers, manage team assignments, and maintain social profile credentials.
          </p>
        </div>

        {/* Primary Button Primitives - Admin & Team Admin Register & Batch Import & Admin Governance */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          {isTrueAdmin && onOpenAdminPanel && (
            <button
              id="members-admin-panel-btn"
              onClick={onOpenAdminPanel}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm leading-5 font-black bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
              title="Open Admin Governance & Role Assignment Panel"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              <span>Admin Governance</span>
            </button>
          )}

          {allowAdd ? (
            <>
              <button
                id="members-batch-btn"
                onClick={onOpenBatchRegister}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm leading-5 font-black btn-secondary text-black dark:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                <span>Batch Import (Sheet)</span>
              </button>
              <button
                id="members-add-btn"
                onClick={onOpenAddMember}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm leading-5 font-black btn-primary text-white transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Member</span>
              </button>
            </>
          ) : (
            <div className="text-xs font-black text-black dark:text-white opacity-80 px-3 py-1.5 rounded-xl glass-panel-subtle self-start sm:self-auto border border-slate-200 dark:border-white/10">
              <span>Admin authorization required to register members</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Key Statistics Cards (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-6 text-black dark:text-white">
        <div className="col-span-12 md:col-span-6">
          <StatCard
            title="Total Members"
            value={memberStats.totalMembers || members.length}
            description="Registered active contributors in ACES"
            icon={<Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <StatCard
            title="Teams Tracking"
            value={memberStats.teamsTracking || TEAMS_LIST.length - 1}
            description="Core technical &amp; operational divisions"
            icon={<Layers className="w-5 h-5 text-[#9d4edd] dark:text-[#c77dff]" />}
            hideDescription={false}
          />
        </div>
      </div>

      {/* 3. Search, Sort & Team Tabs Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 text-black dark:text-white">
        
        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Member Search Input Primitive */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white opacity-70" />
            <input
              id="members-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by member name, position, email, team..."
              className="w-full pl-9 pr-8 py-2 text-sm leading-5 glass-input rounded-xl placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none transition-all duration-200 font-black text-black dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs leading-4 opacity-80 hover:opacity-100 cursor-pointer font-black text-black dark:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector & View Mode Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl btn-secondary text-sm leading-5 font-black text-black dark:text-white">
              <ArrowUpDown className="w-4 h-4 opacity-80" />
              <label htmlFor="member-sort-select" className="text-xs leading-4 font-black text-black dark:text-white">Sort:</label>
              <select
                id="member-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-sm leading-5 font-black text-black dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="name-asc" className="bg-white dark:bg-slate-900 text-black dark:text-white">Name (A-Z)</option>
                <option value="name-desc" className="bg-white dark:bg-slate-900 text-black dark:text-white">Name (Z-A)</option>
                <option value="team" className="bg-white dark:bg-slate-900 text-black dark:text-white">Team</option>
              </select>
            </div>

            {/* View Mode Toggle: Table (List) vs Cards (Grid) */}
            <div className="flex items-center p-1 rounded-xl btn-secondary">
              <button
                id="members-view-table-btn"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === 'table' ? 'bg-black/30 dark:bg-white/10 text-white shadow-xs' : 'text-black dark:text-white opacity-70 hover:opacity-100'
                }`}
                title="Dense List View"
                aria-label="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                id="members-view-cards-btn"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  viewMode === 'cards' ? 'bg-black/30 dark:bg-white/10 text-white shadow-xs' : 'text-black dark:text-white opacity-70 hover:opacity-100'
                }`}
                title="Card Grid View"
                aria-label="Card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Clickable Team Tabs */}
        <div className="pt-3 border-t border-slate-200 dark:border-[var(--panel-border)] overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 min-w-max">
            {TEAMS_LIST.map((teamName) => {
              const isActive = selectedTeam === teamName;
              const count = getTeamCount(teamName);

              return (
                <button
                  key={teamName}
                  id={`team-tab-${teamName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectTeam(teamName)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs leading-4 font-black transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'btn-primary shadow-xs font-black text-white'
                      : 'btn-secondary text-black dark:text-white opacity-90 hover:opacity-100'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-black dark:text-white'}>{teamName}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-black rounded ${
                      isActive 
                        ? 'bg-black/20 text-white' 
                        : 'bg-black/10 dark:bg-white/10 text-black dark:text-white'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Members Directory: List View (Table) or Card Grid */}
      {filteredMembers.length > 0 ? (
        <>
          {viewMode === 'table' ? (
          /* List / Table View */
          <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/10 flex flex-col">
            <div className="overflow-auto max-h-[calc(100vh-320px)] min-h-[360px] relative">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 text-[11px] font-black uppercase tracking-wider text-black dark:text-slate-200 shadow-xs">
                  <tr>
                    <th className="sticky top-0 z-10 py-3.5 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 text-black dark:text-slate-200">Name</th>
                    <th className="sticky top-0 z-10 py-3.5 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 text-black dark:text-slate-200">Team</th>
                    <th className="sticky top-0 z-10 py-3.5 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 text-black dark:text-slate-200">Position</th>
                    <th className="sticky top-0 z-10 py-3.5 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 text-black dark:text-slate-200">Email</th>
                    <th className="sticky top-0 z-10 py-3.5 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 text-black dark:text-slate-200">Socials</th>
                    <th className="sticky top-0 z-10 py-3.5 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 text-right text-black dark:text-slate-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-semibold">
                  {itemsToDisplay.map((member) => {
                    const isNotActive = member.status?.toUpperCase() === 'NOT_ACTIVE';
                    const photo = member.profile_photo_url || member.avatar;
                    const hasNoProfileImage = !photo || photo.trim() === '' || photo.includes('dicebear');

                    const socialLinks = member.social_links || member.socials || {};
                    const instagramUrl = socialLinks.instagram
                      ? (socialLinks.instagram.startsWith('http') ? socialLinks.instagram : `https://instagram.com/${socialLinks.instagram.replace('@', '')}`)
                      : null;
                    const linkedinUrl = socialLinks.linkedin
                      ? (socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : `https://linkedin.com/in/${socialLinks.linkedin}`)
                      : null;
                    const githubUrl = socialLinks.github
                      ? (socialLinks.github.startsWith('http') ? socialLinks.github : `https://github.com/${socialLinks.github}`)
                      : null;

                    return (
                      <tr
                        key={member.id}
                        onClick={() => onViewMember(member)}
                        className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        {/* Name */}
                        <td className="py-3.5 px-4 font-bold text-black dark:text-white">
                          <div className="flex items-center gap-2">
                            {isNotActive && (
                              <span title="Status: NOT_ACTIVE" className="inline-flex items-center shrink-0">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                              </span>
                            )}
                            {hasNoProfileImage && (
                              <span title="Profile image not uploaded" className="inline-flex items-center shrink-0">
                                <ImageIcon className="w-4 h-4 text-red-500" />
                              </span>
                            )}
                            <span 
                              className="font-bold text-black dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                              title={member.name || 'Unnamed Member'}
                            >
                              {member.name || 'Unnamed Member'}
                            </span>
                          </div>
                        </td>

                        {/* Team */}
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold btn-secondary text-black dark:text-white">
                            {member.team || 'Web Team'}
                          </span>
                        </td>

                        {/* Position */}
                        <td className="py-3.5 px-4 text-xs font-semibold text-black dark:text-white opacity-90">
                          {member.position || member.role || 'Member'}
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 text-xs font-semibold text-black dark:text-white">
                          {member.email ? (
                            <a
                              href={`mailto:${member.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-black dark:text-white hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              title={member.email}
                            >
                              {member.email}
                            </a>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        {/* Socials */}
                        <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            {instagramUrl && (
                              <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg btn-secondary flex items-center justify-center text-[#E4405F] hover:bg-pink-50 dark:hover:bg-pink-950/40 transition-colors cursor-pointer"
                                title="Instagram Profile"
                                aria-label={`${member.name}'s Instagram`}
                              >
                                <InstagramIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {linkedinUrl && (
                              <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg btn-secondary flex items-center justify-center text-[#0A66C2] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                                title="LinkedIn Profile"
                                aria-label={`${member.name}'s LinkedIn`}
                              >
                                <LinkedinIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {githubUrl && (
                              <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-lg btn-secondary flex items-center justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="GitHub Profile"
                                aria-label={`${member.name}'s GitHub`}
                              >
                                <GithubIcon className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {!instagramUrl && !linkedinUrl && !githubUrl && (
                              <span className="text-xs text-slate-400 opacity-40 font-medium">-</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => onViewMember(member)}
                              className="p-1.5 rounded-lg btn-secondary transition-colors cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                              title="View Details"
                              aria-label="View member details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onEditMember(member)}
                              className="p-1.5 rounded-lg btn-secondary transition-colors cursor-pointer hover:text-amber-600 dark:hover:text-amber-400"
                              title="Edit Member"
                              aria-label="Edit member"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteMember(member.id, member.name)}
                              className="p-1.5 rounded-lg btn-secondary hover:text-rose-500 transition-colors cursor-pointer"
                              title="Delete Member"
                              aria-label="Delete member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards Grid View */
          <div className="grid grid-cols-12 gap-6">
            {itemsToDisplay.map((member) => (
              <div key={member.id} className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3">
                <MemberCard
                  member={member}
                  onView={onViewMember}
                  onEdit={onEditMember}
                  onDelete={onDeleteMember}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={page}
          totalPages={totalPages || Math.max(1, Math.ceil(filteredMembers.length / pageSize))}
          totalItems={totalCount !== undefined ? totalCount : filteredMembers.length}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[6, 12, 24, 48]}
          itemLabel="members"
        />
        </>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 text-black dark:text-white">
          <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto text-black dark:text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base leading-6 font-black text-black dark:text-white">No team members found</h3>
            <p className="text-sm leading-5 opacity-80 max-w-sm mx-auto mt-1 font-semibold text-black dark:text-white">
              No profiles match your current search query or team category filter.
            </p>
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectTeam('All Teams');
            }}
            className="px-4 py-2 rounded-xl text-sm leading-5 font-black btn-secondary inline-flex items-center gap-2 cursor-pointer transition-all duration-200 text-black dark:text-white"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default MembersView;

