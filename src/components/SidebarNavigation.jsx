import { 
  Home, 
  Users, 
  Calendar, 
  Radio, 
  BookOpen, 
  Sparkles, 
  ExternalLink,
  X,
  FileSpreadsheet,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

/**
 * SidebarNavigation Component
 * Multi-Theme Navigation rail for ACES CMS.
 * Responsive off-canvas mobile drawer with smooth backdrop blur.
 * Strictly adheres to theme design tokens.
 */
export function SidebarNavigation({
  currentView = 'dashboard',
  onSelectView,
  isMobileOpen = false,
  onCloseMobile,
  counts = {},
  isAdmin = true,
}) {
  // Navigation Menu definition adhering strictly to CMS requirements
  const navItems = [
    {
      id: 'dashboard',
      label: 'Launchpad',
      icon: Home,
      description: 'Metrics, live radar & events',
    },
    {
      id: 'members',
      label: 'Member Council',
      icon: Users,
      description: 'Full team directory & hierarchy',
      badge: counts.members ? `${counts.members}` : null,
    },
    {
      id: 'events',
      label: 'Events & Lineup',
      icon: Calendar,
      description: 'Hackathons, mixers & workshops',
      badge: counts.events ? `${counts.events}` : null,
    },
    {
      id: 'fee-verification',
      label: 'Fee Verification',
      icon: CheckCircle2,
      description: 'Audit & verify student payments',
      badge: counts.feePending ? `${counts.feePending}` : null,
    },
    {
      id: 'announcements',
      label: 'Broadcast Outbox',
      icon: Radio,
      description: 'Publish announcements & alerts',
      badge: counts.announcements ? `${counts.announcements}` : null,
    },
    {
      id: 'forms',
      label: 'Forms Engine',
      icon: FileSpreadsheet,
      description: 'Dynamic schema forms builder',
      badge: counts.forms ? `${counts.forms}` : null,
    },
    {
      id: 'magazine',
      label: 'Magazine Editions',
      icon: BookOpen,
      description: 'Annual publications & PDFs',
      badge: counts.magazines ? `${counts.magazines}` : null,
    },
    {
      id: 'showcase',
      label: 'Showcase Hub',
      icon: Sparkles,
      description: 'Curated projects & tech assets',
      badge: counts.showcaseCollections || counts.collections || null,
    },
  ];

  if (isAdmin) {
    navItems.push({
      id: 'admin',
      label: 'Admin Command',
      icon: ShieldAlert,
      description: 'Advanced clearances & logs',
    });
  }

  const handleNavClick = (viewId) => {
    onSelectView(viewId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 lg:w-72 z-50 p-3 sm:p-4 flex flex-col justify-between select-none transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar Navigation Rail"
      >
        {/* Panel Container with Opera Geometry */}
        <div className="w-full h-full glass-panel p-3.5 sm:p-4 flex flex-col justify-between shadow-xl relative overflow-hidden text-black dark:text-white">
          
          {/* Top: Brand Header */}
          <div className="relative z-10 space-y-4 text-black dark:text-white">
            <div className="flex items-center justify-between px-1.5 py-1.5 border-b border-[var(--panel-border)] pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10 p-1 flex items-center justify-center shadow-xs shrink-0">
                  <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain drop-shadow" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm leading-5 tracking-tight truncate text-black dark:text-white">
                      ACES CMS
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black btn-secondary shrink-0 text-black dark:text-white">
                      2026-27
                    </span>
                  </div>
                  <p className="text-xs leading-4 opacity-80 font-bold truncate text-black dark:text-white">
                    Association of CS Engineers
                  </p>
                </div>
              </div>

              {/* Close Button for Mobile Drawer */}
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 opacity-80 hover:opacity-100 transition-colors cursor-pointer text-black dark:text-white"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items List with Clean Scrollbar-Free Layout */}
            <nav className="space-y-1.5 overflow-y-auto no-scrollbar max-h-[calc(100vh-220px)] text-black dark:text-white" aria-label="Main Menu">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm leading-5 font-bold transition-all duration-200 text-left relative cursor-pointer active:scale-95 ${
                      isActive
                        ? 'btn-primary shadow-sm font-black text-white'
                        : 'hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white opacity-90 hover:opacity-100'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isActive
                            ? 'bg-black/20 text-white'
                            : 'bg-black/5 dark:bg-white/10 opacity-90 group-hover:opacity-100 text-black dark:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs leading-4 font-black truncate">{item.label}</div>
                        <div
                          className={`text-[11px] leading-4 transition-colors duration-200 font-semibold truncate ${
                            isActive ? 'opacity-90 text-white' : 'opacity-80 text-black dark:text-white'
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-black transition-colors duration-200 shrink-0 ${
                          isActive
                            ? 'bg-black/25 text-white rounded-md'
                            : 'btn-secondary rounded-none border border-[var(--panel-border)] text-black dark:text-white'
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
          <div className="relative z-10 space-y-2.5 pt-3 border-t border-[var(--panel-border)]">
            <a
              href="https://acesclub.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 text-xs leading-4 font-bold opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors duration-200 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-indigo-400" />
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
