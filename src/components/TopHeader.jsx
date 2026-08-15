import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  Sparkles, 
  UserCheck, 
  LogOut, 
  User,
  UserPlus,
  LogIn,
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
  currentTheme = 'deep-midnight',
  onSelectTheme,
  user,
  isAdmin,
  onOpenLogin,
  onOpenProfile,
  onOpenRegister,
  onLogout,
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
    <header className="sticky top-0 z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 py-4">
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

        {/* Right: Multi-Theme Switcher and User Profile / Login */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Selector */}
          <ThemeSelector
            currentTheme={currentTheme}
            onSelectTheme={onSelectTheme}
          />

          {/* User Profile Dropdown or Login Button */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                id="admin-profile-btn"
                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                className="flex items-center gap-2.5 p-1 pr-2.5 rounded-xl btn-secondary transition-colors duration-200 cursor-pointer"
                aria-expanded={isAdminMenuOpen}
              >
                <div className="relative">
                  <img
                    src={user.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                    alt={user.name || 'User Avatar'}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
                  />
                  <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-black/40 ${isAdmin ? 'bg-emerald-500' : 'bg-indigo-400'}`} />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs leading-4 font-bold max-w-[120px] truncate">
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
                <div className="absolute right-0 mt-2 w-64 acrylic-dialog rounded-xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <div className="p-3 glass-panel-subtle rounded-lg mb-1.5">
                    <div className="text-xs leading-4 font-bold truncate">{user.name || 'Member Profile'}</div>
                    <div className="text-[11px] leading-4 opacity-70 font-medium truncate">{user.email}</div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      <UserCheck className="w-3 h-3 text-indigo-400" />
                      <span>{isAdmin ? 'Admin Clearance' : `${user.team || 'Member'}`}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 text-xs leading-4 font-semibold">
                    
                    {/* Edit Profile */}
                    <button
                      onClick={() => {
                        setIsAdminMenuOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 opacity-70 text-indigo-400" />
                      <span>My Profile & Details</span>
                    </button>

                    {/* Admin Only: Register New Member */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setIsAdminMenuOpen(false);
                          if (onOpenRegister) onOpenRegister();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-colors cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-indigo-400" />
                        <span>Register New Member</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-white/10" />

                    {/* Log Out */}
                    <button
                      onClick={() => {
                        setIsAdminMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
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
              className="flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-xs font-bold shadow-md cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

export default TopHeader;

