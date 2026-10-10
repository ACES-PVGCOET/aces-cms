import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Users, 
  Calendar, 
  Megaphone, 
  Globe, 
  ExternalLink,
  X,
  ClipboardList,
  CheckCircle2,
  FolderArchive,
  ChevronsRight,
  ChevronsLeft
} from 'lucide-react';

/**
 * SidebarNavigation Component
 * Multi-Theme Navigation rail for ACES CMS.
 * Features ultra-smooth animated transitions between compact (icon-only, default) and expanded modes.
 */
export function SidebarNavigation({
  currentView = 'dashboard',
  onSelectView,
  isMobileOpen = false,
  onCloseMobile,
  isExpanded: controlledExpanded,
  onToggleExpand,
  counts = {},
}) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Navigation Menu definition - descriptions removed per requirements
  const navItems = [
    {
      id: 'dashboard',
      label: 'Launchpad',
      icon: LayoutGrid,
    },
    {
      id: 'members',
      label: 'Committee',
      icon: Users,
    },
    {
      id: 'fee-verification',
      label: 'Fee Verification',
      icon: CheckCircle2,
    },
    {
      id: 'events',
      label: 'Event Lineup',
      icon: Calendar,
    },
    {
      id: 'forms',
      label: 'Forms Engine',
      icon: ClipboardList,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
    },
    {
      id: 'showcase',
      label: 'Media Showcase',
      icon: FolderArchive,
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
        className={`fixed top-0 left-0 bottom-0 z-50 p-2.5 sm:p-3 flex flex-col justify-between select-none transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64 lg:w-72' : 'w-24'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Sidebar Navigation Rail"
      >
        {/* Panel Container with Refined Geometry & Purple Accents */}
        <div className={`w-full h-full glass-panel flex flex-col justify-between shadow-xl relative overflow-hidden bg-white/95 dark:bg-slate-900/95 border border-purple-100 dark:border-purple-900/30 rounded-2xl text-slate-900 dark:text-white transition-all duration-300 ease-in-out ${
          isExpanded ? 'p-3.5 sm:p-4' : 'px-2 py-3.5 items-center'
        }`}>
          
          {/* Top: Brand Header */}
          <div className="relative z-10 w-full space-y-3.5 text-slate-900 dark:text-white flex flex-col items-center">
            <div className={`w-full flex items-center border-b border-purple-100 dark:border-slate-800/80 pb-3 h-14 transition-all duration-300 ${
              isExpanded ? 'justify-between px-1' : 'justify-center'
            }`}>
              <div 
                className="flex items-center gap-3 min-w-0 cursor-pointer group"
                onClick={handleToggleExpand}
                title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-white/10 p-2 flex items-center justify-center shadow-xs shrink-0 border border-purple-100/80 dark:border-white/10 group-hover:scale-105 transition-transform duration-200">
                  <img src="/logo.png" alt="ACES Logo" className="w-full h-full object-contain drop-shadow" />
                </div>
                <div className={`flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0 pointer-events-none'
                }`}>
                  <span className="font-extrabold text-sm leading-5 tracking-tight truncate text-slate-900 dark:text-white whitespace-nowrap">
                    ACES CMS
                  </span>
                  <p className="text-xs leading-4 opacity-75 font-semibold truncate text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    Association of CS Engineers
                  </p>
                </div>
              </div>

              {/* Close Button for Mobile Drawer */}
              {isMobileOpen && (
                <button
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 rounded-xl hover:bg-purple-50 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer text-slate-800 dark:text-white shrink-0"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Navigation Items List */}
            <nav className="w-full overflow-y-auto no-scrollbar max-h-[calc(100vh-220px)] space-y-2.5 flex flex-col items-center" aria-label="Main Menu">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`group flex items-center rounded-xl font-bold transition-all duration-300 ease-in-out cursor-pointer active:scale-95 relative overflow-hidden ${
                      isExpanded ? 'w-full px-3 py-2.5' : 'w-12 h-12 justify-center p-0'
                    } ${
                      isActive
                        ? 'bg-[#9d4edd] text-white shadow-md shadow-[#9d4edd]/35 ring-2 ring-[#9d4edd]/40'
                        : isExpanded
                          ? 'hover:bg-purple-50/80 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:text-[#9d4edd] dark:hover:text-[#c77dff]'
                          : 'bg-slate-100/80 dark:bg-slate-800/70 hover:bg-purple-100/80 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 hover:text-[#9d4edd] dark:hover:text-[#c77dff] border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                    title={item.label}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className={`flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isExpanded ? 'w-8 h-8 rounded-lg' : 'w-full h-full'
                    } ${
                      isExpanded && isActive ? 'bg-white/20 text-white shadow-inner' : ''
                    } ${
                      isExpanded && !isActive ? 'bg-purple-50/70 dark:bg-white/5 text-[#9d4edd] dark:text-[#c77dff] group-hover:bg-purple-100 dark:group-hover:bg-white/10' : ''
                    }`}>
                      <Icon className={`w-5 h-5 shrink-0 stroke-[2.2] transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-[#9d4edd] dark:group-hover:text-[#c77dff]'
                      }`} />
                    </div>

                    <span className={`text-xs font-bold truncate whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'opacity-100 max-w-[160px] ml-3' : 'opacity-0 max-w-0 ml-0 pointer-events-none'
                    } ${
                      isActive ? 'text-white font-extrabold' : 'text-slate-900 dark:text-white group-hover:text-[#9d4edd] dark:group-hover:text-[#c77dff]'
                    }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom: Public Site Link & Expand/Collapse Toggle */}
          <div className="relative z-10 w-full pt-3 border-t border-purple-100 dark:border-slate-800/80 space-y-2 flex flex-col items-center">
            {/* Public Site Link */}
            <a
              href="https://acespvgcoet.in"
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer active:scale-95 overflow-hidden ${
                isExpanded 
                  ? 'w-full px-3 py-2.5 justify-between text-slate-700 dark:text-slate-300 hover:text-[#9d4edd] dark:hover:text-[#c77dff] hover:bg-purple-50/80 dark:hover:bg-white/5' 
                  : 'w-12 h-12 justify-center p-0 bg-purple-50/80 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:text-[#9d4edd] dark:hover:text-[#c77dff] hover:bg-purple-100 dark:hover:bg-slate-700 border border-purple-100/60 dark:border-slate-700/60'
              }`}
              title="Visit Main Website (acespvgcoet.in)"
              aria-label="Visit Main Website"
            >
              <div className={`flex items-center min-w-0 ${isExpanded ? 'gap-2.5' : 'justify-center w-full h-full'}`}>
                <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'w-7 h-7' : 'w-full h-full'}`}>
                  <Globe className="w-5 h-5 text-[#9d4edd] stroke-[2.2] shrink-0" />
                </div>
                <span className={`truncate whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0 pointer-events-none hidden'
                }`}>
                  Visit Main Website
                </span>
              </div>
              <ExternalLink className={`w-3.5 h-3.5 opacity-60 shrink-0 transition-all duration-300 ${
                isExpanded ? 'opacity-60 scale-100' : 'opacity-0 scale-0 pointer-events-none hidden'
              }`} />
            </a>

            {/* Expand / Collapse Button */}
            <button
              onClick={handleToggleExpand}
              className={`group flex items-center rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer active:scale-95 overflow-hidden shadow-xs ${
                isExpanded
                  ? 'w-full px-3 py-2.5 justify-between bg-purple-50/80 dark:bg-slate-800/80 hover:bg-purple-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#9d4edd] dark:hover:text-[#c77dff] border border-purple-100 dark:border-slate-700'
                  : 'w-12 h-12 justify-center p-0 bg-[#9d4edd]/10 hover:bg-[#9d4edd]/20 text-[#9d4edd] border border-[#9d4edd]/30'
              }`}
              title={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
              aria-label={isExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <div className={`flex items-center min-w-0 ${isExpanded ? 'gap-2.5' : 'justify-center w-full h-full'}`}>
                <div className={`flex items-center justify-center shrink-0 ${isExpanded ? 'w-7 h-7' : 'w-full h-full'}`}>
                  {isExpanded ? (
                    <ChevronsLeft className="w-5 h-5 text-[#9d4edd] stroke-[2.2] shrink-0" />
                  ) : (
                    <ChevronsRight className="w-5 h-5 text-[#9d4edd] stroke-[2.2] shrink-0" />
                  )}
                </div>
                <span className={`truncate whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'opacity-100 max-w-[130px]' : 'opacity-0 max-w-0 pointer-events-none hidden'
                }`}>
                  Collapse Sidebar
                </span>
              </div>
              <span className={`text-[10px] opacity-60 font-mono uppercase font-semibold transition-all duration-300 ${
                isExpanded ? 'opacity-60 scale-100' : 'opacity-0 scale-0 pointer-events-none hidden'
              }`}>
                Hide
              </span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}

export default SidebarNavigation;
