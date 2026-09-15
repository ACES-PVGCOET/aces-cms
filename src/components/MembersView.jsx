import { 
  Users, 
  Layers, 
  Plus, 
  Search, 
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';
import StatCard from './StatCard';
import MemberCard from './MemberCard';

/**
 * MembersView Component
 * Multi-Theme Member directory adhering strictly to semantic design tokens.
 */
export function MembersView({
  members = [],
  filteredMembers = [],
  searchQuery,
  onSearchChange,
  selectedTeam,
  onSelectTeam,
  sortBy,
  onSortChange,
  memberStats = {},
  onOpenAddMember,
  onOpenBatchRegister,
  onViewMember,
  onEditMember,
  onDeleteMember,
  allowAdd = true,
}) {
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
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-black btn-primary shadow-xs text-white">
              Guild Directory
            </span>
            <span className="text-xs leading-4 font-black btn-secondary px-2.5 py-0.5 rounded-md text-black dark:text-white">
              {filteredMembers.length} records displayed
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-black tracking-tight mt-1 text-black dark:text-white">
            <span className="classic-dotted-heading">Member Hub</span>
          </h1>
          <p className="text-sm leading-5 text-black dark:text-white opacity-80 font-semibold">
            Discover engineers, manage guild assignments, and maintain social profile credentials.
          </p>
        </div>

        {/* Primary Button Primitives - Admin & Team Admin Register & Batch Import */}
        {allowAdd ? (
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
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
          </div>
        ) : (
          <div className="text-xs font-black text-black dark:text-white opacity-80 px-3 py-1.5 rounded-xl glass-panel-subtle self-start sm:self-auto border border-slate-200 dark:border-white/10">
            <span>Admin authorization required to register members</span>
          </div>
        )}
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
            title="Guilds Tracking"
            value={memberStats.teamsTracking || TEAMS_LIST.length - 1}
            description="Core technical &amp; operational divisions"
            icon={<Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
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

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
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
                <option value="team" className="bg-white dark:bg-slate-900 text-black dark:text-white">Team Guild</option>
              </select>
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

      {/* 4. Members 12-Column Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-12 gap-6">
          {filteredMembers.map((member) => (
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
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 text-black dark:text-white">
          <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto text-black dark:text-white">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base leading-6 font-black text-black dark:text-white">No guild members found</h3>
            <p className="text-sm leading-5 opacity-80 max-w-sm mx-auto mt-1 font-semibold text-black dark:text-white">
              No profiles match your current search query or guild category filter.
            </p>
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectTeam('All Teams');
            }}
            className="px-4 py-2 rounded-xl text-sm leading-5 font-black btn-secondary inline-flex items-center gap-2 cursor-pointer transition-all duration-200 text-black dark:text-white"
          >
            <span>Reset Guild Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default MembersView;

