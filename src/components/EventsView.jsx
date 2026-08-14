import { 
  Calendar, 
  CalendarCheck2, 
  Clock, 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Users 
} from 'lucide-react';
import StatCard from './StatCard';
import EventCard from './EventCard';

/**
 * EventsView Component
 * Multi-Theme dynamic event lineup manager.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm and 12-column CSS Grid.
 */
export function EventsView({
  events = [],
  filteredEvents = [],
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  modeFilter,
  onModeFilterChange,
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
              Event Orchestration
            </span>
            <span className="text-xs leading-4 font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              {filteredEvents.length} sessions listed
            </span>
          </div>
          <h1 className="text-2xl leading-8 sm:text-3xl sm:leading-9 font-extrabold tracking-tight mt-1">
            Event Lineup
          </h1>
          <p className="text-sm leading-5 opacity-70 font-medium">
            Schedule hackathons, workshops, keynote panels, and track live RSVP attendance across campus.
          </p>
        </div>

        {/* Primary CTA Button Primitive */}
        <button
          id="events-schedule-btn"
          onClick={onOpenCreateEvent}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-primary self-start sm:self-auto shrink-0 transition-all duration-300 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Event</span>
        </button>
      </div>

      {/* 2. 3 Statistics Cards (12-Col Grid) */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4">
          <StatCard
            title="Total Sessions"
            value={eventStats.totalEvents}
            description="Scheduled workshops, hackathons & mixers"
            icon={<Calendar className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <StatCard
            title="Active / Live"
            value={eventStats.upcomingCount}
            description="Sessions currently scheduled or broadcasting"
            icon={<Clock className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>

        <div className="col-span-12 md:col-span-4">
          <StatCard
            title="Total RSVPs Tracked"
            value={eventStats.totalRSVPs}
            description="Registered student attendees in ACES database"
            icon={<Users className="w-5 h-5" />}
            hideDescription={false}
          />
        </div>
      </div>

      {/* 3. Search & Filter Controls Toolbar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Event Search Input Primitive */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              id="events-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by event title, venue, organizer, or #tags..."
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
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-3 py-2 rounded-lg btn-secondary text-sm leading-5 font-bold focus:outline-none cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Live">Live Now</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>

            {/* Mode Filter */}
            <select
              value={modeFilter}
              onChange={(e) => onModeFilterChange(e.target.value)}
              className="px-3 py-2 rounded-lg btn-secondary text-sm leading-5 font-bold focus:outline-none cursor-pointer"
            >
              <option value="All Modes">All Modes</option>
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>

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
            <h3 className="text-base leading-6 font-extrabold">No scheduled events match</h3>
            <p className="text-sm leading-5 opacity-70 max-w-sm mx-auto mt-1 font-medium">
              Try resetting your filters or search keywords to view the complete club calendar.
            </p>
          </div>
          <button
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('All Statuses');
              onModeFilterChange('All Modes');
            }}
            className="px-4 py-2 rounded-lg text-sm leading-5 font-medium btn-secondary inline-flex items-center gap-2 cursor-pointer transition-all duration-300"
          >
            <span>Reset Event Filters</span>
          </button>
        </div>
      )}

    </div>
  );
}

export default EventsView;
