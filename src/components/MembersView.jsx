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
import { TEAMS_LIST } from '../data/mockData';

/**
 * MembersView Component
 * Multi-Theme dynamic member hub directory.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm and 12-column CSS Grid.
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
  memberStats,
  isAdmin = true,
  onOpenAddMember,
  onOpenBatchRegister,
  onViewMember,
  onEditMember,
  onDeleteMember,
}) {
  const getTeamCount = (teamName) => {
    if (teamName === 'All Teams') return members.length;
    return members.filter((m) => m.team === teamName).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary shadow-xs">
              Guild Directory
            </span>
            <span className="text-xs leading-4 font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              {filteredMembers.length} records displayed
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-extrabold tracking-tight mt-1">
            Member Hub
          </h1>
          <p className="text-sm leading-5 opacity-70 font-medium">
            Discover engineers, manage guild assignments, and maintain social profile credentials.
          </p>
        </div>

        {/* Primary Button Primitives - Admin Register & Batch Import */}
        {isAdmin ? (
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
            <button
              id="members-batch-btn"
              onClick={onOpenBatchRegister}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm leading-5 font-bold btn-secondary transition-all duration-300 cursor-pointer border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Batch Import (Sheet)</span>
            </button>
            <button
              id="members-add-btn"
              onClick={onOpenAddMember}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm leading-5 font-bold btn-primary transition-all duration-300 cursor-pointer shadow-md bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Member</span>
            </button>
          </div>
        ) : (
          <div className="text-xs opacity-60 font-semibold px-3 py-1.5 rounded-lg glass-panel-subtle self-start sm:self-auto">
            <span>Admin authorization required to register members</span>
          </div>
        )}
      </div>

      {/* 2. Key Statistics Cards (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <StatCard
            title="Total Members"
            value={memberStats.totalMembers}
            description="Registered active contributors in ACES"
            icon={<Users className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <StatCard
            title="Guilds Tracking"
            value={memberStats.teamsTracking}
            description="Core technical & operational divisions"
            icon={<Layers className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>
      </div>

      {/* 3. Search, Sort & Team Tabs Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        
        {/* Search Input & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Member Search Input Primitive */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              id="members-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by member name, position, email, team..."
              className="w-full pl-9 pr-8 py-2 text-sm leading-5 glass-input rounded-lg placeholder-slate-400 focus:outline-none transition-all duration-300 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs leading-4 opacity-60 hover:opacity-100 cursor-pointer font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg btn-secondary text-sm leading-5 font-bold">
              <ArrowUpDown className="w-4 h-4 opacity-80" />
              <label htmlFor="member-sort-select" className="opacity-70 text-xs leading-4 font-semibold">Sort:</label>
              <select
                id="member-sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-sm leading-5 font-bold focus:outline-none cursor-pointer"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="team">Team Guild</option>
              </select>
            </div>
          </div>

        </div>

        {/* Clickable Team Tabs */}
        <div className="pt-3 border-t border-white/10 overflow-x-auto pb-1">
          <div className="flex items-center gap-2 min-w-max">
            {TEAMS_LIST.map((teamName) => {
              const isActive = selectedTeam === teamName;
              const count = getTeamCount(teamName);

              return (
                <button
                  key={teamName}
                  id={`team-tab-${teamName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onSelectTeam(teamName)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs leading-4 font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'btn-primary shadow-xs font-extrabold'
                      : 'btn-secondary opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>{teamName}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      isActive 
                        ? 'bg-black/20 text-white' 
                        : 'bg-black/10 dark:bg-white/10'
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
        <div className="glass-card rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base leading-6 font-extrabold">No guild members found</h3>
            <p className="text-sm leading-5 opacity-70 max-w-sm mx-auto mt-1 font-medium">
              No profiles match your current search query or guild category filter.
            </p>
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectTeam('All Teams');
            }}
            className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-secondary inline-flex items-center gap-2 cursor-pointer transition-all duration-300"
          >
            <span>Reset Guild Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default MembersView;
