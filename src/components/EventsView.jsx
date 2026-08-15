import { 
  Calendar, 
  CalendarCheck2, 
  Sparkles, 
  Plus, 
  Search, 
  LayoutGrid, 
  List 
} from 'lucide-react';
import StatCard from './StatCard';
import EventCard from './EventCard';

/**
 * EventsView Component
 * Dynamic event lineup manager strictly reflecting backend Event API model:
 * overview, description, terms, reg_form_id, banner_url, isHighlight.
 */
export function EventsView({
  filteredEvents = [],
  searchQuery,
  onSearchChange,
  highlightFilter = 'All',
  onHighlightFilterChange,
  viewMode = 'grid',
  onViewModeChange,
  eventStats,
  onOpenCreateEvent,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary shadow-xs">
              Event Management
            </span>
            <span className="text-xs leading-4 font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              {filteredEvents.length} events listed
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-extrabold tracking-tight mt-1">
            Events Collection
          </h1>
          <p className="text-sm leading-5 opacity-70 font-medium">
            Manage association events, descriptions, terms & conditions, registration forms, and spotlight highlights.
          </p>
        </div>

        {/* Primary CTA Button */}
        <button
          id="events-schedule-btn"
          onClick={onOpenCreateEvent}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-primary self-start sm:self-auto shrink-0 transition-all duration-300 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* 2. Key Statistics Cards (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <StatCard
            title="Total Events"
            value={eventStats?.totalEvents || filteredEvents.length}
            description="Active events registered in backend database"
            icon={<Calendar className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <StatCard
            title="Highlighted Events"
            value={eventStats?.highlightedCount || 0}
            description="Featured homepage showcase sessions (Max 4)"
            icon={<Sparkles className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>
      </div>

      {/* 3. Search & Filter Controls Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Event Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              id="events-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by event overview, description, terms, or form ID..."
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

          {/* Filter Dropdowns & View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Highlight Filter */}
            {onHighlightFilterChange && (
              <select
                value={highlightFilter}
                onChange={(e) => onHighlightFilterChange(e.target.value)}
                className="px-3 py-2 rounded-lg btn-secondary text-sm leading-5 font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Events</option>
                <option value="Highlighted">Highlighted Only</option>
                <option value="Standard">Standard Only</option>
              </select>
            )}

            {/* Grid vs List View Toggle */}
            <div className="flex items-center p-1 rounded-lg btn-secondary">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'btn-primary shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Grid View"
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'btn-primary shadow-xs'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="List View"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 4. Events 12-Column Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-12 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={
                viewMode === 'grid'
                  ? 'col-span-12 sm:col-span-6 lg:col-span-4'
                  : 'col-span-12'
              }
            >
              <EventCard
                event={event}
                onView={onViewEvent}
                onEdit={onEditEvent}
                onDelete={onDeleteEvent}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl btn-secondary flex items-center justify-center mx-auto">
            <CalendarCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base leading-6 font-extrabold">No events match search criteria</h3>
            <p className="text-sm leading-5 opacity-70 max-w-sm mx-auto mt-1 font-medium">
              Try clearing search keywords or resetting highlight filters.
            </p>
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              if (onHighlightFilterChange) onHighlightFilterChange('All');
            }}
            className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-secondary inline-flex items-center gap-2 cursor-pointer transition-all duration-300"
          >
            <span>Reset Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default EventsView;

