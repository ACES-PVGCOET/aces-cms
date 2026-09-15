import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  ChevronDown, 
  User, 
  UserPlus, 
  LogOut, 
  LogIn, 
  Command,
  UserCheck,
  Bell,
  X
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

/**
 * TopHeader Component
 * Sticky top navigation bar for global search, multi-theme switching, and authentication.
 * Multi-Theme compatible adhering strictly to semantic design tokens.
 */
export function TopHeader({
  searchQuery = '',
  onSearchChange,
  currentTheme = 'sky-white',
  onSelectTheme,
  user,
  isAdmin,
  onOpenLogin,
  onOpenProfile,
  onOpenRegister,
  onLogout,
  onToggleMobileSidebar,
}) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
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
    <>
      <header className="sticky top-0 z-20 w-full max-w-7xl mx-auto px-3 sm:px-8 py-3 sm:py-4">
        <div className="glass-panel rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-4 shadow-sm backdrop-blur-md">
          
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl btn-secondary transition-colors duration-200 cursor-pointer shrink-0"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Left: Global Search Input with Smooth Hover Expand */}
          <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative group/search focus-within:max-w-xl">
            <div
              className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all duration-300 glass-input hover:border-sky-500/40 dark:hover:border-indigo-500/40 ${
                isSearchFocused
                  ? 'ring-2 ring-sky-500/30 dark:ring-indigo-500/30 scale-[1.01] shadow-md'
                  : 'hover:shadow-xs'
              }`}
            >
              <Search className="w-4 h-4 opacity-60 shrink-0 group-hover/search:opacity-100 transition-opacity" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search members, events, guilds, tags..."
                className="w-full bg-transparent text-sm leading-5 placeholder-gray-400 focus:outline-none font-medium"
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
                <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold opacity-60 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded shadow-2xs">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Theme Selector, Notification Bell & User Profile / Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Selector Toggle */}
            {onSelectTheme && (
              <ThemeSelector
                currentTheme={currentTheme}
                onSelectTheme={onSelectTheme}
              />
            )}

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-xl btn-secondary transition-all duration-200 active:scale-95 cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 opacity-80" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {/* User Profile Dropdown or Login Button */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="admin-profile-btn"
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center gap-2.5 p-1 pr-2.5 rounded-xl btn-secondary transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs"
                  aria-expanded={isAdminMenuOpen}
                >
                  <div className="relative">
                    <img
                      src={user.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                      alt={user.name || 'User Avatar'}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-black/10 dark:ring-white/20"
                    />
                    <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-black/40 ${isAdmin ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs leading-4 font-extrabold max-w-[120px] truncate">
                      {user.name || 'Member'}
                    </div>
                    <div className="text-[10px] leading-3 opacity-70 font-semibold mt-0.5 max-w-[120px] truncate">
                      {user.position || 'Member'}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 acrylic-dialog rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="p-3 glass-panel-subtle rounded-xl mb-1.5">
                      <div className="text-xs leading-4 font-extrabold truncate">{user.name || 'Member Profile'}</div>
                      <div className="text-[11px] leading-4 opacity-70 font-medium truncate">{user.email}</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold btn-secondary">
                        <UserCheck className="w-3 h-3 text-sky-600 dark:text-indigo-400" />
                        <span>{isAdmin ? 'Admin Clearance' : `${user.team || 'Member'}`}</span>
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs leading-4 font-bold">
                      
                      {/* Edit Profile */}
                      <button
                        onClick={() => {
                          setIsAdminMenuOpen(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-sky-600 dark:text-indigo-400" />
                        <span>My Profile & Details</span>
                      </button>

                      {/* Admin Only: Register New Member */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsAdminMenuOpen(false);
                            if (onOpenRegister) onOpenRegister();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-sky-600 dark:text-indigo-300 transition-colors cursor-pointer text-left font-bold"
                        >
                          <UserPlus className="w-4 h-4 text-sky-600 dark:text-indigo-400" />
                          <span>Register New Member</span>
                        </button>
                      )}

                      <div className="my-1 border-t border-[var(--panel-border)]" />

                      {/* Log Out */}
                      <button
                        onClick={() => {
                          setIsAdminMenuOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Notification Drawer Modal */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md acrylic-dialog rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--panel-border)]">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-sky-600 dark:text-indigo-400" />
                <h3 className="text-base font-extrabold">Notifications</h3>
              </div>
              <button
                onClick={() => setIsNotificationOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 opacity-70 hover:opacity-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-6 text-center opacity-60 text-xs font-semibold">
              No unread notifications at this time.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopHeader;
