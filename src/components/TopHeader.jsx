import { useState, useRef, useEffect, useMemo } from 'react';
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
  X,
  Users,
  Calendar,
  ClipboardList,
  CheckCircle2,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

/**
 * TopHeader Component
 * Sticky top navigation bar for global omnibar search, multi-theme switching, and authentication.
 * Instant search overlay across members, events, forms, fee records, and announcements.
 */
export function TopHeader({
  searchQuery = '',
  onSearchChange,
  currentTheme = 'sky-white',
  onSelectTheme,
  user,
  isAdmin,
  onSelectView,
  onOpenLogin,
  onOpenProfile,
  onOpenRegister,
  onLogout,
  onToggleMobileSidebar,
  members = [],
  events = [],
  forms = [],
  registrations = [],
  announcements = [],
  onViewMember,
  onViewEvent,
  onInspectRegistration,
}) {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Global Ctrl+K / Cmd+K listener to focus search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setIsAdminMenuOpen(false);
        setIsNotificationOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAdminMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cross-system filtered search results
  const searchResults = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q || q.length < 1) return null;

    const matchedMembers = members.filter(
      (m) =>
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.team && m.team.toLowerCase().includes(q)) ||
        (m.position && m.position.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedEvents = events.filter(
      (e) =>
        (e.overview && e.overview.toLowerCase().includes(q)) ||
        (e.title && e.title.toLowerCase().includes(q)) ||
        (e.description && e.description.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedForms = forms.filter(
      (f) =>
        (f.title && f.title.toLowerCase().includes(q)) ||
        (f.description && f.description.toLowerCase().includes(q)) ||
        (f.form_id && f.form_id.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedFees = registrations.filter(
      (r) =>
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.roll_no && r.roll_no.toLowerCase().includes(q)) ||
        (r.prn && r.prn.toLowerCase().includes(q)) ||
        (r.class && r.class.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedAnnouncements = announcements.filter(
      (a) =>
        (a.topic && a.topic.toLowerCase().includes(q)) ||
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.body && a.body.toLowerCase().includes(q))
    ).slice(0, 2);

    const totalCount =
      matchedMembers.length +
      matchedEvents.length +
      matchedForms.length +
      matchedFees.length +
      matchedAnnouncements.length;

    return {
      members: matchedMembers,
      events: matchedEvents,
      forms: matchedForms,
      fees: matchedFees,
      announcements: matchedAnnouncements,
      totalCount,
    };
  }, [searchQuery, members, events, forms, registrations, announcements]);

  const handleSelectSearchResult = (type, item) => {
    setIsSearchFocused(false);
    if (type === 'member') {
      if (onSelectView) onSelectView('members');
      if (onViewMember) onViewMember(item);
    } else if (type === 'event') {
      if (onSelectView) onSelectView('events');
      if (onViewEvent) onViewEvent(item);
    } else if (type === 'form') {
      if (onSelectView) onSelectView('forms');
    } else if (type === 'fee') {
      if (onSelectView) onSelectView('fee-verification');
      if (onInspectRegistration) onInspectRegistration(item);
    } else if (type === 'announcement') {
      if (onSelectView) onSelectView('announcements');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 w-full max-w-7xl mx-auto px-3 sm:px-8 py-3 sm:py-4">
        <div className="glass-panel rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-4 shadow-sm backdrop-blur-md border border-purple-100 dark:border-purple-900/30">
          
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl btn-secondary transition-colors duration-200 cursor-pointer shrink-0"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Left: Global Search Input with Instant Omnibar Popover */}
          <div 
            ref={searchContainerRef}
            className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative group/search focus-within:max-w-xl"
          >
            <div
              className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all duration-300 glass-input hover:border-purple-500/40 dark:hover:border-purple-500/40 ${
                isSearchFocused
                  ? 'ring-2 ring-purple-500/30 dark:ring-purple-500/30 scale-[1.01] shadow-md border-purple-400'
                  : 'hover:shadow-xs'
              }`}
            >
              <Search className="w-4 h-4 opacity-60 shrink-0 group-hover/search:opacity-100 transition-opacity text-purple-600 dark:text-purple-400" />
              <input
                ref={searchInputRef}
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Quick search members, events, forms, fees..."
                className="w-full bg-transparent text-sm leading-5 placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none font-medium"
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
                <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold opacity-60 bg-purple-100/60 dark:bg-white/10 px-1.5 py-0.5 rounded text-purple-800 dark:text-purple-300 shadow-2xs">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              )}
            </div>

            {/* Instant Search Results Dropdown Palette */}
            {isSearchFocused && searchResults && (
              <div className="absolute left-0 right-0 mt-2 w-full max-h-[420px] overflow-y-auto rounded-2xl acrylic-dialog p-3 shadow-2xl z-50 border border-purple-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
                
                {searchResults.totalCount === 0 ? (
                  <div className="py-6 text-center text-xs opacity-70 font-semibold">
                    No results found matching "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    
                    {/* Members Matches */}
                    {searchResults.members.length > 0 && (
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 px-2 py-1 flex items-center gap-1.5">
                          <Users className="w-3 h-3" />
                          <span>Members ({searchResults.members.length})</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {searchResults.members.map((mem) => (
                            <button
                              key={mem.id}
                              onClick={() => handleSelectSearchResult('member', mem)}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-white/10 text-left transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={mem.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(mem.email)}`}
                                  alt={mem.name}
                                  className="w-6 h-6 rounded-lg object-cover"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 dark:text-white truncate">{mem.name}</div>
                                  <div className="text-[10px] opacity-70 truncate">{mem.team} • {mem.position}</div>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Events Matches */}
                    {searchResults.events.length > 0 && (
                      <div className="border-t border-purple-100 dark:border-slate-800 pt-2">
                        <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 px-2 py-1 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          <span>Events ({searchResults.events.length})</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {searchResults.events.map((evt) => (
                            <button
                              key={evt.id}
                              onClick={() => handleSelectSearchResult('event', evt)}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-white/10 text-left transition-colors cursor-pointer group"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate">{evt.overview || evt.title}</div>
                                <div className="text-[10px] opacity-70 truncate">{evt.status} • {evt.mode || 'Campus'}</div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fee Registrations Matches */}
                    {searchResults.fees.length > 0 && (
                      <div className="border-t border-purple-100 dark:border-slate-800 pt-2">
                        <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 px-2 py-1 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Fee Records ({searchResults.fees.length})</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {searchResults.fees.map((reg) => (
                            <button
                              key={reg.id || reg._id}
                              onClick={() => handleSelectSearchResult('fee', reg)}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-white/10 text-left transition-colors cursor-pointer group"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate">{reg.name} ({reg.class})</div>
                                <div className="text-[10px] opacity-70 truncate">Roll: {reg.roll_no} • Status: {reg.status}</div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Forms Matches */}
                    {searchResults.forms.length > 0 && (
                      <div className="border-t border-purple-100 dark:border-slate-800 pt-2">
                        <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 px-2 py-1 flex items-center gap-1.5">
                          <ClipboardList className="w-3 h-3" />
                          <span>Forms Engine ({searchResults.forms.length})</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {searchResults.forms.map((form) => (
                            <button
                              key={form.id || form.form_id}
                              onClick={() => handleSelectSearchResult('form', form)}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-white/10 text-left transition-colors cursor-pointer group"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate">{form.title}</div>
                                <div className="text-[10px] opacity-70 truncate">{form.questions?.length || 0} questions • {form.is_active ? 'Active' : 'Closed'}</div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Announcements Matches */}
                    {searchResults.announcements.length > 0 && (
                      <div className="border-t border-purple-100 dark:border-slate-800 pt-2">
                        <div className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 px-2 py-1 flex items-center gap-1.5">
                          <Megaphone className="w-3 h-3" />
                          <span>Announcements</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {searchResults.announcements.map((ann) => (
                            <button
                              key={ann.id}
                              onClick={() => handleSelectSearchResult('announcement', ann)}
                              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-white/10 text-left transition-colors cursor-pointer group"
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate">{ann.topic || ann.title}</div>
                                <div className="text-[10px] opacity-70 truncate">{ann.body || ann.content}</div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
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
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-200 dark:ring-white/20"
                    />
                    <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1 ring-black/40 ${isAdmin ? 'bg-emerald-500' : 'bg-purple-500'}`} />
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
                  <div className="absolute right-0 mt-2 w-64 acrylic-dialog rounded-2xl p-2 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50 border border-purple-100 dark:border-slate-800">
                    <div className="p-3 glass-panel-subtle rounded-xl mb-1.5">
                      <div className="text-xs leading-4 font-extrabold truncate">{user.name || 'Member Profile'}</div>
                      <div className="text-[11px] leading-4 opacity-70 font-medium truncate">{user.email}</div>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        <UserCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
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
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-white/10 transition-colors cursor-pointer text-left"
                      >
                        <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span>My Profile & Details</span>
                      </button>

                      {/* Admin Governance Panel Link */}
                      {isAdmin && onSelectView && (
                        <button
                          onClick={() => {
                            setIsAdminMenuOpen(false);
                            onSelectView('admin-panel');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-white/10 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer text-left font-bold"
                        >
                          <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span>Admin Governance Panel</span>
                        </button>
                      )}

                      {/* Admin Only: Register New Member */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsAdminMenuOpen(false);
                            if (onOpenRegister) onOpenRegister();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-white/10 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer text-left font-bold"
                        >
                          <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
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
