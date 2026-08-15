import { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Plus, 
  CalendarPlus, 
  Megaphone, 
  Download, 
  ArrowUpRight, 
  Activity, 
  BookOpen, 
  Radio, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import StatCard from './StatCard';
import ActiveMembersPieCard from './ActiveMembersPieCard';
import MediaViewer from './MediaViewer';

/**
 * DashboardView (Launchpad) Component
 * Multi-Theme dynamic dashboard.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm and 12-column CSS Grid.
 */
export function DashboardView({
  members = [],
  events = [],
  isAdmin = true,
  onNavigate,
  onOpenAddMember,
  onOpenCreateEvent,
  onOpenBroadcast,
  onOpenUploadMagazine,
  onExportData,
  onViewEvent,
}) {
  const teamsCount = new Set(members.map((m) => m.team).filter(Boolean)).size || 10;

  const defaultSpotlight =
    events.find((e) => (e.overview || e.title || '').includes("Dino's Leaf Party")) ||
    events.find((e) => e.isHighlight || e.featured) ||
    events[0] || {
      id: 'default-evt',
      overview: "Dino's Leaf Party",
      description: "An exclusive tech networking mixer & gamified speed coding showdown.",
      banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      isHighlight: true,
    };

  const [hoveredEvent, setHoveredEvent] = useState(defaultSpotlight);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl p-6 glass-panel shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs leading-4 font-bold btn-secondary shadow-xs">
            <Sparkles className="w-4 h-4 opacity-80" />
            <span>ACES Central Command • Academic Year 2026-27</span>
          </div>

          <h1 className="text-3xl leading-9 sm:text-4xl sm:leading-10 font-extrabold tracking-tight">
            Welcome to your{' '}
            <span className="opacity-90 underline decoration-indigo-500/50">
              ACES CMS launchpad
            </span>
          </h1>

          <p className="text-sm leading-5 sm:text-base sm:leading-6 opacity-80 font-medium">
            Orchestrate members, synchronize guild workflows, and schedule high-impact campus tech experiences with real-time public website reflection.
          </p>
        </div>
      </section>

      {/* 2. Top Key Statistics & Quick Actions (12-Col Grid) */}
      <section aria-label="Key Statistics and Quick Actions">
        <div className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* Col 1-4: Active Members Pie Card */}
          <div className="col-span-12 md:col-span-4">
            <ActiveMembersPieCard members={members} />
          </div>

          {/* Col 5-8: Teams Collaborating Stat Card */}
          <div className="col-span-12 md:col-span-4">
            <StatCard
              title="Teams Collaborating"
              value={`${teamsCount} Guilds`}
              description="Faculty, Leaders, Technical, Web, Editorial, Design, Marketing, Media, Event & Treasury"
              icon={<Layers className="w-5 h-5" />}
              hideDescription={false}
            />
          </div>

          {/* Col 9-12: Quick Actions Panel */}
          <div className="col-span-12 md:col-span-4">
            <div className="w-full h-full glass-card rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 opacity-80" />
                  <h2 className="text-sm leading-5 font-bold">
                    Quick Actions
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Register Member (Admin) */}
                <button
                  id="quick-action-add-member"
                  onClick={onOpenAddMember}
                  className="flex items-center gap-2 p-2 rounded-lg btn-secondary group text-left cursor-pointer"
                  title={isAdmin ? "Register new member & generate onboarding link" : "View members"}
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-bold truncate">{isAdmin ? 'Register Member' : 'Members'}</div>
                    <div className="text-xs leading-4 opacity-60 truncate font-medium">{isAdmin ? 'Onboard recruit' : 'Guild directory'}</div>
                  </div>
                </button>

                {/* Create Event */}
                <button
                  id="quick-action-create-event"
                  onClick={onOpenCreateEvent}
                  className="flex items-center gap-2 p-2 rounded-lg btn-secondary group text-left cursor-pointer"
                  title="Schedule a new session"
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0">
                    <CalendarPlus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-bold truncate">Create Event</div>
                    <div className="text-xs leading-4 opacity-60 truncate font-medium">Schedule</div>
                  </div>
                </button>

                {/* Forms Engine */}
                <button
                  id="quick-action-forms-engine"
                  onClick={() => onNavigate('forms')}
                  className="flex items-center gap-2 p-2 rounded-lg btn-secondary group text-left cursor-pointer"
                  title="Forms engine & responses"
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-bold truncate">Forms Engine</div>
                    <div className="text-xs leading-4 opacity-60 truncate font-medium">Forms & CSV</div>
                  </div>
                </button>

                {/* Broadcast */}
                <button
                  id="quick-action-broadcast"
                  onClick={onOpenBroadcast}
                  className="flex items-center gap-2 p-2 rounded-lg btn-secondary group text-left cursor-pointer"
                  title="Simulate marketing broadcast"
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-bold truncate">Broadcast</div>
                    <div className="text-xs leading-4 opacity-60 truncate font-medium">Feeds</div>
                  </div>
                </button>
              </div>

              {/* Bottom Export JSON button */}
              <button
                id="quick-action-export"
                onClick={onExportData}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg btn-secondary text-xs leading-4 font-bold cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4 opacity-80" />
                  <span>Export Public JSON</span>
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-60" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Events & Spotlight Section */}
      <section
        id="events-in-motion-section"
        className="glass-panel rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary flex items-center gap-1.5 shadow-xs">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Highlighted Showcase</span>
              </span>
              <span className="text-xs leading-4 font-semibold opacity-70">
                {events.length} events active
              </span>
            </div>
            <h2 className="text-2xl leading-8 font-extrabold tracking-tight mt-1">
              Events Showcase
            </h2>
            <p className="text-xs leading-4 opacity-70 font-medium mt-0.5">
              Select any event to view description, terms & conditions, and registration form ID.
            </p>
          </div>

          <button
            onClick={() => onNavigate('events')}
            className="flex items-center gap-1.5 text-xs leading-4 font-bold opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span>Explore All Events</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 12-Col Grid: Events List (5 Cols) & Spotlight Preview (7 Cols) */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left 5 Cols: Events List */}
          <div className="col-span-12 lg:col-span-5 space-y-3">
            <span className="text-xs leading-4 font-bold opacity-70 uppercase tracking-wider block">
              Active Events
            </span>

            <div className="space-y-2">
              {events.slice(0, 4).map((evt) => {
                const isSelected = hoveredEvent.id === evt.id;
                const displayTitle = evt.overview || evt.title || 'ACES Event';
                const displayBanner = evt.banner_url || evt.banner || '';

                return (
                  <div
                    key={evt.id}
                    onMouseEnter={() => setHoveredEvent(evt)}
                    onClick={() => setHoveredEvent(evt)}
                    className={`p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'btn-primary shadow-xs'
                        : 'glass-panel-subtle hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/40 relative">
                        <MediaViewer
                          src={displayBanner}
                          alt={displayTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs leading-4 font-bold truncate">
                          {displayTitle}
                        </div>
                        <div className="flex items-center gap-2 text-xs leading-4 opacity-70 mt-0.5">
                          <span className="truncate">{evt.description}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {evt.isHighlight && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black">
                          Spotlight
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5' : 'opacity-60'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 7 Cols: Spotlight Panel */}
          <div className="col-span-12 lg:col-span-7">
            <div className="h-full rounded-2xl overflow-hidden glass-card shadow-sm flex flex-col justify-between">
              
              {/* Spotlight Banner Preview */}
              <div className="relative h-48 bg-black/40 overflow-hidden">
                <MediaViewer
                  src={hoveredEvent.banner_url || hoveredEvent.banner}
                  alt={hoveredEvent.overview || hoveredEvent.title}
                  className="w-full h-full object-cover"
                  showVideoBadge={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Selected Event</span>
                  </span>
                  {hoveredEvent.isHighlight && (
                    <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold bg-amber-500 text-black">
                      Highlighted
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-lg leading-7 font-black truncate mt-0.5">
                    {hoveredEvent.overview || hoveredEvent.title}
                  </h3>
                </div>
              </div>

              {/* Spotlight Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs leading-4 sm:text-sm sm:leading-5 opacity-80 line-clamp-3 font-medium">
                    {hoveredEvent.description}
                  </p>

                  {hoveredEvent.terms && (
                    <div className="text-xs leading-4 font-semibold glass-panel-subtle p-3 rounded-xl space-y-0.5">
                      <span className="text-[10px] uppercase font-bold opacity-60 block">Terms</span>
                      <p className="opacity-80 line-clamp-2">{hoveredEvent.terms}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onViewEvent && onViewEvent(hoveredEvent)}
                  className="w-full py-2 px-4 rounded-lg text-sm leading-5 font-medium btn-primary text-center cursor-pointer transition-all duration-300"
                >
                  Manage Event Details
                </button>

              </div>

            </div>
          </div>

        </div>
      </section>
    
    </div>
  );
}

export default DashboardView;
