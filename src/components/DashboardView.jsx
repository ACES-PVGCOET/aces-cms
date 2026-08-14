import { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Plus, 
  CalendarPlus, 
  Megaphone, 
  Download, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  Activity, 
  BookOpen, 
  Radio, 
  ChevronRight 
} from 'lucide-react';
import StatCard from './StatCard';
import ActiveMembersPieCard from './ActiveMembersPieCard';
import MediaViewer from './MediaViewer';
import { RECENT_ACTIVITIES } from '../data/mockData';

/**
 * DashboardView (Launchpad) Component
 * Multi-Theme dynamic dashboard.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm and 12-column CSS Grid.
 */
export function DashboardView({
  members = [],
  events = [],
  onNavigate,
  onOpenAddMember,
  onOpenCreateEvent,
  onOpenBroadcast,
  onOpenUploadMagazine,
  onExportData,
  onViewEvent,
}) {
  const eventsInMotion = events.filter((e) => e.status === 'Scheduled' || e.status === 'Live');
  const teamsCount = new Set(members.map((m) => m.team).filter(Boolean)).size || 10;

  const defaultSpotlight =
    events.find((e) => e.title.includes("Dino's Leaf Party")) ||
    events.find((e) => e.featured) ||
    events[0] || {
      id: 'default-evt',
      title: "Dino's Leaf Party",
      description: "An exclusive tech networking mixer & gamified speed coding showdown.",
      date: '2026-09-18',
      time: '4:30 PM - 8:00 PM',
      mode: 'Offline',
      venue: 'ACES Main Innovation Hall & Green Terrace',
      attendeesCount: 142,
      capacity: 160,
      banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      organizerTeam: 'Web Team & Design',
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

          {/* Highlights */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs leading-4 font-bold">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg btn-secondary">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Multi-Theme Engine</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg btn-secondary">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>10 Core Guilds Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg btn-secondary">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Live Public Bridge</span>
            </div>
          </div>
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
                <span className="text-xs leading-4 font-bold btn-secondary px-2 py-0.5 rounded-md">
                  Instant
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Add Member */}
                <button
                  id="quick-action-add-member"
                  onClick={onOpenAddMember}
                  className="flex items-center gap-2 p-2 rounded-lg btn-secondary group text-left cursor-pointer"
                  title="Add new member to guild directory"
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-bold truncate">Add Member</div>
                    <div className="text-xs leading-4 opacity-60 truncate font-medium">New recruit</div>
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

                {/* Upload Magazine */}
                <button
                  id="quick-action-upload-magazine"
                  onClick={onOpenUploadMagazine}
                  className="flex items-center gap-2 p-2 rounded-lg btn-secondary group text-left cursor-pointer"
                  title="Upload annual edition"
                >
                  <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs leading-4 font-bold truncate">Upload Mag</div>
                    <div className="text-xs leading-4 opacity-60 truncate font-medium">2026-27 Edition</div>
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

      {/* 3. Events in Motion & Spotlight Section (12-Col Grid) */}
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
                <span>Live Orchestration</span>
              </span>
              <span className="text-xs leading-4 font-semibold opacity-70">
                {eventsInMotion.length} sessions active
              </span>
            </div>
            <h2 className="text-2xl leading-8 font-extrabold tracking-tight mt-1">
              Events in Motion
            </h2>
            <p className="text-xs leading-4 opacity-70 font-medium mt-0.5">
              Select any session to spotlight event details, RSVP capacity, and live logistics.
            </p>
          </div>

          <button
            onClick={() => onNavigate('events')}
            className="flex items-center gap-1.5 text-xs leading-4 font-bold opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span>Explore Full Lineup</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* 12-Col Grid: Sessions List (5 Cols) & Spotlight Preview (7 Cols) */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left 5 Cols: Active Sessions */}
          <div className="col-span-12 lg:col-span-5 space-y-3">
            <span className="text-xs leading-4 font-bold opacity-70 uppercase tracking-wider block">
              Active Sessions
            </span>

            <div className="space-y-2">
              {eventsInMotion.slice(0, 4).map((evt) => {
                const isSelected = hoveredEvent.id === evt.id;
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
                          src={evt.banner}
                          alt={evt.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs leading-4 font-bold truncate">
                          {evt.title}
                        </div>
                        <div className="flex items-center gap-2 text-xs leading-4 opacity-70 mt-0.5">
                          <span className="truncate">{evt.date}</span>
                          <span>•</span>
                          <span className="font-bold">{evt.mode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded text-xs leading-4 font-bold bg-black/20 text-white">
                        {evt.attendeesCount} RSVP
                      </span>
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
                  src={hoveredEvent.banner}
                  alt={hoveredEvent.title}
                  className="w-full h-full object-cover"
                  showVideoBadge={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-primary flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Spotlight Session</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs leading-4 font-bold btn-secondary">
                    {hoveredEvent.mode}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                    {hoveredEvent.organizerTeam || 'ACES Central'}
                  </span>
                  <h3 className="text-lg leading-7 font-black truncate mt-0.5">
                    {hoveredEvent.title}
                  </h3>
                </div>
              </div>

              {/* Spotlight Details & Action Primitives */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs leading-4 sm:text-sm sm:leading-5 opacity-80 line-clamp-2 font-medium">
                    {hoveredEvent.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs leading-4 font-semibold glass-panel-subtle p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 opacity-80 shrink-0" />
                      <span className="truncate">{hoveredEvent.time || '4:30 PM - 8:00 PM'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 opacity-80 shrink-0" />
                      <span className="truncate">{hoveredEvent.venue || 'Innovation Hall'}</span>
                    </div>
                  </div>
                </div>

                {/* RSVP Capacity Progress & CTA Button Primitive */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs leading-4 font-bold">
                    <span className="opacity-70">Attendance Capacity</span>
                    <span className="font-extrabold">
                      {hoveredEvent.attendeesCount || 142} / {hoveredEvent.capacity || 160}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full btn-primary rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((hoveredEvent.attendeesCount || 142) / (hoveredEvent.capacity || 160)) * 100)
                        )}%`,
                      }}
                    />
                  </div>

                  <button
                    onClick={() => onViewEvent && onViewEvent(hoveredEvent)}
                    className="w-full py-2 px-4 rounded-lg text-sm leading-5 font-medium btn-primary text-center cursor-pointer transition-all duration-300"
                  >
                    Manage Spotlight Session
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. Live Activity Log Feed */}
      <section aria-label="Live Club Activity Feed">
        <div className="glass-panel rounded-2xl p-6 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 opacity-80" />
              <h2 className="text-sm leading-5 font-bold">
                Live Activity Stream
              </h2>
            </div>
            <span className="text-xs leading-4 font-bold btn-secondary px-2.5 py-0.5 rounded-md">
              {RECENT_ACTIVITIES.length} Events Logged
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
            {RECENT_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-4 text-xs leading-4 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold leading-snug">
                      {act.message}
                    </p>
                    <span className="text-xs leading-4 opacity-60 font-medium">
                      {act.time}
                    </span>
                  </div>
                </div>

                {act.badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold btn-secondary shrink-0">
                    {act.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

export default DashboardView;
