import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  RefreshCw, 
  UserCheck, 
  Settings, 
  LogOut, 
  ExternalLink,
  Command
} from 'lucide-react';
import ThemeSelector from './ThemeSelector';

/**
 * TopHeader Component
 * Dynamic Multi-Theme Header supporting Deep Midnight, Pastel Aurora, and Cyber Emerald.
 */
export function TopHeader({
  searchQuery,
  onSearchChange,
  onSyncWebsite,
  isSyncing = false,
  onOpenNotifications,
  unreadCount = 2,
  currentTheme = 'deep-midnight',
  onSelectTheme,
}) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAdminMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full px-6 py-4">
      <div className="glass-panel rounded-2xl px-5 py-3 flex items-center justify-between gap-4 shadow-sm backdrop-blur-md">
        
        {/* Left: Global Search Input */}
        <div className="flex-1 max-w-md relative">
          <div
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-200 glass-input ${
              isSearchFocused
                ? 'ring-2 ring-indigo-500/20'
                : ''
            }`}
          >
            <Search className="w-4 h-4 opacity-70 shrink-0" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search members, events, guilds, tags..."
              className="w-full bg-transparent text-sm leading-5 placeholder-slate-400 focus:outline-none font-medium"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs leading-4 opacity-60 hover:opacity-100 px-1 cursor-pointer font-bold"
                aria-label="Clear search"
              >
                ✕
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold opacity-60 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded shadow-2xs">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Multi-Theme Switcher, Sync, Notifications, and Admin Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 1. 3-Theme Selector */}
          <ThemeSelector
            currentTheme={currentTheme}
            onSelectTheme={onSelectTheme}
          />

          {/* 2. Sync to Public ACES Website Button */}
          <button
            id="sync-website-btn"
            onClick={onSyncWebsite}
            disabled={isSyncing}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm leading-5 font-bold btn-secondary transition-all duration-200 cursor-pointer shadow-xs"
            title="Publish all approved live records to the public ACES website"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Website'}</span>
          </button>

          {/* 3. Notification Bell with Badge */}
          <button
            id="notification-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl btn-secondary transition-colors duration-200 cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </button>

          {/* 4. Admin Profile Avatar & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="admin-profile-btn"
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              className="flex items-center gap-2.5 p-1 pr-2.5 rounded-xl btn-secondary transition-colors duration-200 cursor-pointer"
              aria-expanded={isAdminMenuOpen}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Admin Avatar"
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-black/40" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs leading-4 font-bold">
                  Aarav Sharma
                </div>
                <div className="text-[10px] leading-3 opacity-70 font-semibold mt-0.5">
                  Super Admin
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Admin Dropdown Menu */}
            {isAdminMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 acrylic-dialog rounded-xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="p-3 glass-panel-subtle rounded-lg mb-1.5">
                  <div className="text-xs leading-4 font-bold">Aarav Sharma</div>
                  <div className="text-[11px] leading-4 opacity-70 font-medium">lead.admin@acesclub.org</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <UserCheck className="w-3 h-3 text-emerald-500" />
                    <span>Root Access Granted</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs leading-4 font-semibold">
                  <button
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      alert('ACES CMS System Status: All cluster nodes operational, 0 errors.');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 opacity-70" />
                    <span>Club Settings & Guilds</span>
                  </button>

                  <a
                    href="https://acesclub.org/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>ACES CMS Docs</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      alert('You are authenticated in Super Admin mode.');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Switch Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}

export default TopHeader;
