import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Megaphone, 
  FolderKanban,
  ClipboardList,
  Sparkles,
  ExternalLink,
  UserCog,
  X
} from 'lucide-react';

/**
 * SidebarNavigation Component
 * Multi-Theme dynamic sidebar for Deep Midnight, Pastel Aurora, and Cyber Emerald.
 * Responsive off-canvas drawer on mobile viewports.
 */
export function SidebarNavigation({ 
  currentView, 
  onSelectView, 
  counts = {}, 
  isTrueAdmin = false,
  isMobileOpen = false,
  onCloseMobile
}) {
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
    ...(isTrueAdmin
      ? [
          {
            id: 'admin-panel',
            label: 'Admin Panel',
            shortLabel: 'Governance',
            icon: UserCog,
            badge: 'Admin',
            description: 'Roles & activation status',
          },
        ]
      : []),
    {
      id: 'events',
      label: 'Event Lineup',
      shortLabel: 'Events',
      icon: CalendarDays,
      badge: counts.events || null,
      description: 'Sessions & schedule',
    },
    {
      id: 'forms',
      label: 'Forms Engine',
      shortLabel: 'Forms',
      icon: ClipboardList,
      badge: counts.forms || null,
      description: 'Custom forms & responses',
    },
    {
      id: 'announcements',
      label: 'Announcements',
      shortLabel: 'Announcements',
      icon: Megaphone,
      description: 'Public releases',
    },
    {
      id: 'showcase',
      label: 'Media Showcase',
      shortLabel: 'Showcase',
      icon: FolderKanban,
      badge: counts.showcaseCollections || counts.collections || null,
      description: 'Media & collections',
    },
  ];

  const handleNavClick = (id) => {
    onSelectView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 lg:w-72 z-50 p-4 flex flex-col justify-between select-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar Navigation Rail"
      >
        {/* Panel Container */}
        <div className="w-full h-full glass-panel rounded-2xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          
          {/* Top: Brand Header */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between px-2 py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center shadow-md ring-1 ring-white/20 shrink-0">
                  <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain drop-shadow" />
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

              {/* Close Button for Mobile Drawer */}
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-xl hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
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
                    onClick={() => handleNavClick(item.id)}
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

          {/* Bottom: Public Site Link */}
          <div className="relative z-10 space-y-2.5 pt-3 border-t border-white/10">
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
    </>
  );
}

export default SidebarNavigation;
