import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Megaphone, 
  BookOpen,
  Sparkles,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

/**
 * SidebarNavigation Component
 * Multi-Theme dynamic sidebar for Deep Midnight, Pastel Aurora, and Cyber Emerald.
 * Adheres strictly to 4px/8px Baseline Grid & Vertical Rhythm.
 */
export function SidebarNavigation({ currentView, onSelectView, counts = {} }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Launchpad',
      shortLabel: 'Home',
      icon: LayoutDashboard,
      description: 'Overview & metrics',
    },
    {
      id: 'members',
      label: 'Member Hub',
      shortLabel: 'Members',
      icon: Users,
      badge: counts.members || null,
      description: 'Guilds & directory',
    },
    {
      id: 'events',
      label: 'Event Lineup',
      shortLabel: 'Events',
      icon: CalendarDays,
      badge: counts.events || null,
      description: 'Sessions & schedule',
    },
    {
      id: 'announcements',
      label: 'Announcements',
      shortLabel: 'Announcements',
      icon: Megaphone,
      badge: 'Beta',
      description: 'Public releases',
    },
    {
      id: 'magazine',
      label: 'Magazine Archive',
      shortLabel: 'Magazine',
      icon: BookOpen,
      badge: counts.magazines || null,
      description: 'Annual publications',
    },
  ];

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 w-64 lg:w-72 z-30 p-4 flex flex-col justify-between select-none pointer-events-auto"
      aria-label="Sidebar Navigation Rail"
    >
      {/* Panel Container */}
      <div className="w-full h-full glass-panel rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
        
        {/* Top: Brand Header */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center font-black text-lg shadow-sm">
              <span>A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm leading-5 tracking-tight">
                  ACES CMS
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold btn-secondary">
                  2026-27
                </span>
              </div>
              <p className="text-xs leading-4 opacity-70 font-semibold">
                Association of CS Engineers
              </p>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1.5" aria-label="Main Menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm leading-5 font-medium transition-all duration-200 text-left relative cursor-pointer ${
                    isActive
                      ? 'btn-primary shadow-sm font-bold'
                      : 'hover:bg-white/10 opacity-80 hover:opacity-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                        isActive
                          ? 'bg-black/20 text-white'
                          : 'bg-black/10 dark:bg-white/10 opacity-90 group-hover:opacity-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs leading-4 font-bold">{item.label}</div>
                      <div
                        className={`text-[11px] leading-4 transition-colors duration-200 font-medium ${
                          isActive ? 'opacity-90' : 'opacity-60'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'bg-black/25 text-white'
                          : 'btn-secondary'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Cloud Status & Public Site Link */}
        <div className="relative z-10 space-y-2.5 pt-3 border-t border-white/10">
          {/* Status Pill */}
          <div className="px-3 py-2 rounded-xl glass-panel-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs leading-4 font-bold opacity-90">
                Connected to ACES Cloud
              </span>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          {/* Visit public site link */}
          <a
            href="https://acesclub.org"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 text-xs leading-4 font-bold opacity-80 hover:opacity-100 hover:bg-white/10 rounded-xl transition-colors duration-200"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 opacity-80" />
              <span>Visit Main Website</span>
            </span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>

      </div>
    </aside>
  );
}

export default SidebarNavigation;
