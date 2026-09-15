import { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Plus, 
  CalendarPlus, 
  Download, 
  ArrowUpRight, 
  Activity, 
  Radio, 
  ChevronRight,
  ClipboardList,
  CheckCircle2,
  Bell
} from 'lucide-react';
import StatCard from './StatCard';
import ActiveMembersPieCard from './ActiveMembersPieCard';
import MediaViewer from './MediaViewer';
import { RECENT_ACTIVITIES } from '../data/mockData';

/**
 * DashboardView (Launchpad) Component
 * Multi-Theme Dashboard adhering strictly to semantic design tokens.
 * Switches seamlessly between Sky-White light theme and Deep Midnight dark theme.
 */
export function DashboardView({
  members = [],
  events = [],
  isAdmin = true,
  onNavigate,
  onOpenAddMember,
  onOpenCreateEvent,
  onOpenBroadcast,
  onExportData,
  onViewEvent,
}) {
  const activeMembersCount = members.filter((m) => m.status === 'ACTIVE' || m.status === 'Active').length || members.length;
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
    <div className="space-y-6 animate-in fade-in duration-300 text-black dark:text-white">
      
      {/* 1. Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl p-6 glass-panel shadow-sm text-black dark:text-white">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs leading-4 font-black btn-secondary text-black dark:text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-indigo-400" />
            <span>ACES Central Command • Academic Year 2026-27</span>
          </div>

          <h1 className="text-3xl leading-9 sm:text-4xl sm:leading-10 font-extrabold tracking-tight">
            Welcome to your{' '}
            <span className="classic-dotted-heading">
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
          
          {/* Card 1: Active Members (Donut breakdown) */}
          <div className="col-span-12 md:col-span-4">
            <ActiveMembersPieCard members={members} />
          </div>

          {/* Card 2: Teams Collaborating Stat Card */}
          <div className="col-span-12 md:col-span-4">
            <StatCard
              title="Teams Collaborating"
              value={`${teamsCount} Guilds`}
              description="Faculty, Leaders, Technical, Web, Editorial, Design, Marketing, Media, Event & Treasury"
              icon={<Layers className="w-5 h-5 text-sky-600 dark:text-indigo-400" />}
              hideDescription={false}
            />
          </div>

          {/* Card 3: Quick Actions Panel */}
          <div className="col-span-12 md:col-span-4">
            <div className="w-full h-full glass-panel rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600 dark:text-indigo-400" />
                  <h2 className="text-sm leading-5 font-extrabold">
                    Quick Actions
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Register Member (Admin) */}
                <button
                  id="quick-action-add-member"
                  onClick={onOpenAddMember}
                  className="flex items-center gap-2 p-2 rounded-xl btn-secondary group text-left cursor-pointer transition-all duration-200 active:scale-95"
                  title={isAdmin ? "Register new member & generate onboarding link" : "View members"}
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0 shadow-2xs">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-extrabold truncate">{isAdmin ? 'Register Member' : 'Members'}</div>
                    <div className="text-xs leading-4 opacity-70 truncate font-semibold">{isAdmin ? 'Onboard recruit' : 'Guild directory'}</div>
                  </div>
                </button>

                {/* Create Event */}
                <button
                  id="quick-action-create-event"
                  onClick={onOpenCreateEvent}
                  className="flex items-center gap-2 p-2 rounded-xl btn-secondary group text-left cursor-pointer transition-all duration-200 active:scale-95"
                  title="Schedule a new session"
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0 shadow-2xs">
                    <CalendarPlus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-extrabold truncate">Create Event</div>
                    <div className="text-xs leading-4 opacity-70 truncate font-semibold">Schedule</div>
                  </div>
                </button>

                {/* Forms Engine */}
                <button
                  id="quick-action-forms-engine"
                  onClick={() => onNavigate('forms')}
                  className="flex items-center gap-2 p-2 rounded-xl btn-secondary group text-left cursor-pointer transition-all duration-200 active:scale-95"
                  title="Forms engine & responses"
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0 shadow-2xs">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-extrabold truncate">Forms Engine</div>
                    <div className="text-xs leading-4 opacity-70 truncate font-semibold">Forms & CSV</div>
                  </div>
                </button>

                {/* Fee Verification */}
                <button
                  id="quick-action-fees"
                  onClick={() => onNavigate('fee-verification')}
                  className="flex items-center gap-2 p-2 rounded-xl btn-secondary group text-left cursor-pointer transition-all duration-200 active:scale-95"
                  title="Audit & verify membership fees"
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-extrabold truncate">Fee Verification</div>
                    <div className="text-xs leading-4 opacity-70 truncate font-semibold">Audit & Receipts</div>
                  </div>
                </button>
              </div>

              {/* Bottom Export JSON button */}
              <button
                id="quick-action-export"
                onClick={onExportData}
                className="w-full flex items-center justify-between px-4 py-2 rounded-xl btn-secondary text-xs leading-4 font-extrabold cursor-pointer transition-all duration-200 active:scale-95"
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

      {/* 3. Events in Motion & Live Activity Feed (12-Col Grid) */}
      <section
        id="events-in-motion-section"
        className="grid grid-cols-12 gap-6 items-stretch"
      >
        {/* Left 8 Cols: Events in Motion Interactive Section */}
        <div className="col-span-12 lg:col-span-8 glass-panel rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-extrabold btn-primary flex items-center gap-1.5 shadow-xs">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Events in Motion</span>
                </span>
                <span className="text-xs leading-4 font-bold opacity-70">
                  {events.length} events active
                </span>
              </div>
              <h2 className="text-2xl leading-8 font-extrabold tracking-tight mt-1">
                Events Showcase
              </h2>
              <p className="text-xs leading-4 opacity-70 font-semibold mt-0.5">
                Hover over any event below to preview live spotlight banner & details.
              </p>
            </div>

            <button
              onClick={() => onNavigate('events')}
              className="flex items-center gap-1.5 text-xs leading-4 font-extrabold text-sky-600 dark:text-indigo-400 hover:underline transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Explore All Events</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grid: Events Hover List & Spotlight Preview */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Left 5 Cols: Events List */}
            <div className="col-span-12 md:col-span-5 space-y-3">
              <span className="text-xs leading-4 font-extrabold opacity-70 uppercase tracking-wider block">
                Select / Hover Event
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
                          : 'glass-panel-subtle hover:bg-black/5 dark:hover:bg-white/10'
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
            <div className="col-span-12 md:col-span-7">
              <div className="h-full rounded-2xl overflow-hidden glass-card shadow-sm flex flex-col justify-between">
                
                {/* Spotlight Banner Preview */}
                <div className="relative h-44 bg-black/40 overflow-hidden">
                  <MediaViewer
                    src={hoveredEvent.banner_url || hoveredEvent.banner}
                    alt={hoveredEvent.overview || hoveredEvent.title}
                    className="w-full h-full object-cover"
                    showVideoBadge={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-extrabold btn-primary flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Spotlight Active</span>
                    </span>
                    {hoveredEvent.isHighlight && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-extrabold bg-amber-400 text-black">
                        Highlighted
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-base leading-6 font-black truncate">
                      {hoveredEvent.overview || hoveredEvent.title}
                    </h3>
                  </div>
                </div>

                {/* Spotlight Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs leading-4 opacity-80 font-medium line-clamp-2">
                      {hoveredEvent.description}
                    </p>

                    {hoveredEvent.terms && (
                      <div className="text-xs leading-4 font-semibold glass-panel-subtle p-2.5 rounded-xl space-y-0.5">
                        <span className="text-[10px] uppercase font-bold opacity-60 block">Terms</span>
                        <p className="opacity-80 line-clamp-1">{hoveredEvent.terms}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onViewEvent && onViewEvent(hoveredEvent)}
                    className="w-full py-2 px-4 rounded-xl text-xs leading-4 font-extrabold btn-primary text-center cursor-pointer transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    Manage Event Details
                  </button>

                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Right 4 Cols: Scrollable Live Activity Feed */}
        <div className="col-span-12 lg:col-span-4 glass-panel rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--panel-border)]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-600 dark:text-indigo-400" />
                <h3 className="text-sm leading-5 font-extrabold">
                  Live Activity Feed
                </h3>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Live
              </span>
            </div>

            {/* Scrollable Feed List */}
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {RECENT_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl glass-panel-subtle hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold btn-secondary shadow-2xs">
                      {act.badge}
                    </span>
                    <span className="text-[10px] opacity-60 font-semibold">{act.time}</span>
                  </div>
                  <p className="text-xs leading-4 font-bold">{act.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--panel-border)] flex items-center justify-between text-xs leading-4 font-semibold opacity-70">
            <span>Synchronized with ACES API</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Online</span>
          </div>
        </div>

      </section>
    
    </div>
  );
}

export default DashboardView;
