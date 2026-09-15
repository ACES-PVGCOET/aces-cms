import { 
  LayoutGrid, 
  Users, 
  Calendar, 
  Megaphone, 
  Sparkles, 
  ExternalLink,
  X,
  ClipboardList,
  CheckCircle2,
  FolderArchive
} from 'lucide-react';

/**
 * SidebarNavigation Component
 * Multi-Theme Navigation rail for ACES CMS.
 * Strictly mirrors reference design with 7 core modules and purple active accents.
 */
export function SidebarNavigation({
  currentView = 'dashboard',
  onSelectView,
  isMobileOpen = false,
  onCloseMobile,
  counts = {},
}) {
  // Navigation Menu definition matching the reference image strictly
  const navItems = [
    {
      id: 'dashboard',
      label: 'Launchpad',
      icon: LayoutGrid,
      description: 'Overview & metrics',
    },
    {
      id: 'members',
      label: 'Member Hub',
      icon: Users,
      description: 'Guilds & directory',
      badge: counts.members ? `${counts.members}` : null,
    },
    {
      id: 'fee-verification',
      label: 'Fee Verification',
      icon: CheckCircle2,
      description: 'Verify fees & receipts',
      badge: counts.feePending ? `${counts.feePending}` : null,
    },
    {
      id: 'events',
      label: 'Event Lineup',
      icon: Calendar,
      description: 'Sessions & schedule',
      badge: counts.events ? `${counts.events}` : null,
    },
    {
      id: 'forms',
      label: 'Forms Engine',
      icon: ClipboardList,
      description: 'Custom forms & responses',
      badge: counts.forms ? `${counts.forms}` : null,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      description: 'Public releases',
      badge: counts.announcements ? `${counts.announcements}` : null,
    },
    {
      id: 'showcase',
      label: 'Media Showcase',
      icon: FolderArchive,
      description: 'Media & collections',
      badge: counts.showcase || null,
    },
  ];

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
        {/* Panel Container with Refined Geometry & Purple Accents */}
        <div className="w-full h-full glass-panel p-3.5 sm:p-4 flex flex-col justify-between shadow-xl relative overflow-hidden bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-900/30 rounded-3xl text-slate-900 dark:text-white">
          
          {/* Top: Brand Header */}
          <div className="relative z-10 space-y-3.5 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between px-1.5 py-1 border-b border-purple-100 dark:border-slate-800/80 pb-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-white/10 p-1.5 flex items-center justify-center shadow-xs shrink-0 border border-purple-100/80 dark:border-white/10">
                  <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain drop-shadow" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm leading-5 tracking-tight truncate text-slate-900 dark:text-white">
                      ACES CMS
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 shrink-0 border border-purple-200/60 dark:border-purple-800/40">
                      2026–27
                    </span>
                  </div>
                  <p className="text-xs leading-4 opacity-75 font-semibold truncate text-slate-600 dark:text-slate-400 mt-0.5">
                    Association of CS Engineers
                  </p>
                </div>
              </div>

              {/* Close Button for Mobile Drawer */}
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer text-slate-800 dark:text-white"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items List */}
            <nav className="space-y-1.5 overflow-y-auto no-scrollbar max-h-[calc(100vh-210px)]" aria-label="Main Menu">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm leading-5 font-bold transition-all duration-200 text-left relative cursor-pointer active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/20 font-extrabold'
                        : 'hover:bg-purple-50/80 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          isActive
                            ? 'bg-white/20 text-white shadow-inner'
                            : 'bg-purple-50/70 dark:bg-white/5 text-purple-600 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs leading-4 font-bold truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300'}`}>
                          {item.label}
                        </div>
                        <div
                          className={`text-[11px] leading-4 transition-colors duration-200 truncate ${
                            isActive ? 'text-white/85 font-medium' : 'text-slate-500 dark:text-slate-400 font-medium'
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {/* Badges */}
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors duration-200 shrink-0 ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-purple-50 text-purple-700 border border-purple-200/70 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/40'
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
          <div className="relative z-10 pt-3 border-t border-purple-100 dark:border-slate-800/80">
            <a
              href="https://acesclub.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 text-xs leading-4 font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50/80 dark:hover:bg-white/5 rounded-xl transition-colors duration-200 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
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

