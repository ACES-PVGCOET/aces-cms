import { useState } from 'react';
import './App.css';

// Hooks
import { useMembers } from './hooks/useMembers';
import { useEvents } from './hooks/useEvents';
import { useAnnouncements } from './hooks/useAnnouncements';
import { useMagazines } from './hooks/useMagazines';

// Utilities
import { 
  downloadJSON, 
  formatPublicEvents, 
  formatPublicMembers, 
  formatPublicMagazines, 
  syncToPublicWebsite 
} from './utils/websiteConnector';

// Core Components
import SidebarNavigation from './components/SidebarNavigation';
import TopHeader from './components/TopHeader';
import DashboardView from './components/DashboardView';
import MembersView from './components/MembersView';
import EventsView from './components/EventsView';
import AnnouncementsView from './components/AnnouncementsView';
import MagazineView from './components/MagazineView';

// Modals & Auxiliary Elements
import MemberModal from './components/MemberModal';
import MemberDetailModal from './components/MemberDetailModal';
import EventModal from './components/EventModal';
import EventDetailModal from './components/EventDetailModal';
import MagazineModal from './components/MagazineModal';
import MagazinePdfModal from './components/MagazinePdfModal';
import NotificationDrawer from './components/NotificationDrawer';
import Toast from './components/Toast';

/**
 * ACES CMS Application
 * Themes:
 *  1. 🌌 Deep Midnight ('deep-midnight')
 *  2. 🌸 Pastel Aurora ('pastel-aurora')
 *  3. ⚡ Cyber Emerald ('cyber-emerald')
 */
function App() {
  // 3-Theme State with fallback & localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('aces_cms_theme_3');
      if (['deep-midnight', 'pastel-aurora', 'cyber-emerald'].includes(stored)) {
        return stored;
      }
      return 'deep-midnight';
    } catch {
      return 'deep-midnight';
    }
  });

  const handleSelectTheme = (newTheme) => {
    if (['deep-midnight', 'pastel-aurora', 'cyber-emerald'].includes(newTheme)) {
      setTheme(newTheme);
      try {
        localStorage.setItem('aces_cms_theme_3', newTheme);
      } catch (e) {
        console.warn('Failed to save theme to localStorage', e);
      }
    }
  };

  // View Navigation State: 'dashboard' | 'members' | 'events' | 'announcements' | 'magazine'
  const [currentView, setCurrentView] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // Data Hooks
  const memberHook = useMembers();
  const eventHook = useEvents();
  const announcementHook = useAnnouncements();
  const magazineHook = useMagazines();

  // Toast feedback state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title });
  };

  // Syncing state
  const [isSyncing, setIsSyncing] = useState(false);

  // Modal States
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);

  const [isMagazineModalOpen, setIsMagazineModalOpen] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState(null);

  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Synchronize global search with active view
  const handleGlobalSearchChange = (query) => {
    setGlobalSearch(query);
    memberHook.setSearchQuery(query);
    eventHook.setSearchQuery(query);
    magazineHook.setSearchQuery(query);
  };

  // --- MEMBER HANDLERS ---
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member) => {
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (formData) => {
    if (editingMember) {
      memberHook.updateMember(editingMember.id, formData);
      showToast(`Member profile for "${formData.name}" updated.`, 'success', 'Member Updated');
    } else {
      memberHook.addMember(formData);
      showToast(`New recruit "${formData.name}" enrolled into ${formData.team}.`, 'success', 'Member Added');
    }
    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from ACES directory?`)) {
      memberHook.deleteMember(id);
      showToast(`Member "${name}" was removed from the registry.`, 'info', 'Member Removed');
      if (viewingMember?.id === id) setViewingMember(null);
    }
  };

  // --- EVENT HANDLERS ---
  const handleOpenCreateEvent = () => {
    setEditingEvent(null);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (event) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (formData) => {
    if (editingEvent) {
      eventHook.updateEvent(editingEvent.id, formData);
      showToast(`Event "${formData.title}" details updated.`, 'success', 'Event Updated');
    } else {
      eventHook.createEvent(formData);
      showToast(`New event "${formData.title}" scheduled for ${formData.date}.`, 'success', 'Event Scheduled');
    }
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      eventHook.deleteEvent(id);
      showToast(`Event "${title}" has been deleted.`, 'info', 'Event Deleted');
      if (viewingEvent?.id === id) setViewingEvent(null);
    }
  };

  // --- MAGAZINE HANDLERS ---
  const handleOpenUploadMagazine = () => {
    setEditingMagazine(null);
    setIsMagazineModalOpen(true);
  };

  const handleOpenEditMagazine = (mag) => {
    setEditingMagazine(mag);
    setIsMagazineModalOpen(true);
  };

  const handleSaveMagazine = (formData) => {
    if (editingMagazine) {
      magazineHook.updateMagazine(editingMagazine.id, formData);
      showToast(`Magazine edition "${formData.title}" updated.`, 'success', 'Edition Updated');
    } else {
      magazineHook.addMagazine(formData);
      showToast(`"${formData.title}" published to digital archive.`, 'success', 'Edition Published');
    }
    setIsMagazineModalOpen(false);
    setEditingMagazine(null);
  };

  const handleDeleteMagazine = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the archive?`)) {
      magazineHook.deleteMagazine(id);
      showToast(`Edition "${title}" removed from archive.`, 'info', 'Magazine Deleted');
      if (magazineHook.viewingPdfMagazine?.id === id) {
        magazineHook.setViewingPdfMagazine(null);
      }
    }
  };

  // --- SYNC & EXPORT HANDLERS ---
  const handleSyncWebsite = async () => {
    setIsSyncing(true);
    showToast('Pushing live updates to ACES public CDN cache...', 'info', 'Syncing');
    
    const payload = {
      events: formatPublicEvents(eventHook.events),
      members: formatPublicMembers(memberHook.members),
      magazines: formatPublicMagazines(magazineHook.magazines),
    };

    const result = await syncToPublicWebsite(payload);
    setIsSyncing(false);
    showToast(`Main website updated with ${result.recordsCount} public records at ${result.syncedAt}.`, 'success', 'Sync Complete');
  };

  const handleExportPublicData = () => {
    const payload = {
      cmsVersion: '2026-27.2',
      academicYear: '2026-27',
      exportedAt: new Date().toISOString(),
      publicEvents: formatPublicEvents(eventHook.events),
      publicMembers: formatPublicMembers(memberHook.members),
      magazines: formatPublicMagazines(magazineHook.magazines),
      announcements: announcementHook.announcements,
    };
    downloadJSON(payload, 'aces-club-public-export-2026-27.json');
    showToast('Public CMS dataset exported for offline website build.', 'success', 'Data Exported');
  };

  const handleBroadcastAnnouncement = (annData) => {
    announcementHook.addAnnouncement(annData);
    showToast(`Announcement "${annData.title}" broadcasted to public feeds.`, 'success', 'Broadcast Queued');
  };

  const themeDisplayNames = {
    'deep-midnight': 'Deep Midnight',
    'pastel-aurora': 'Pastel Aurora',
    'cyber-emerald': 'Cyber Emerald',
  };

  return (
    <div className={`aces-canvas theme-${theme} min-h-screen relative flex font-sans`}>
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <SidebarNavigation
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        counts={{
          members: memberHook.members.length,
          events: eventHook.events.filter((e) => e.status === 'Scheduled' || e.status === 'Live').length,
          magazines: magazineHook.magazines.length,
        }}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 ml-64 lg:ml-72 min-h-screen flex flex-col justify-between">
        
        <div>
          {/* Top Header Bar */}
          <TopHeader
            searchQuery={globalSearch}
            onSearchChange={handleGlobalSearchChange}
            onSyncWebsite={handleSyncWebsite}
            isSyncing={isSyncing}
            onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
            unreadCount={3}
            currentTheme={theme}
            onSelectTheme={handleSelectTheme}
          />

          {/* Active View Container */}
          <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
            
            {/* View 1: Launchpad Dashboard */}
            {currentView === 'dashboard' && (
              <DashboardView
                members={memberHook.members}
                events={eventHook.events}
                onNavigate={setCurrentView}
                onOpenAddMember={handleOpenAddMember}
                onOpenCreateEvent={handleOpenCreateEvent}
                onOpenBroadcast={() => setCurrentView('announcements')}
                onOpenUploadMagazine={handleOpenUploadMagazine}
                onExportData={handleExportPublicData}
                onViewEvent={(event) => setViewingEvent(event)}
              />
            )}

            {/* View 2: Members Hub */}
            {currentView === 'members' && (
              <MembersView
                members={memberHook.members}
                filteredMembers={memberHook.filteredMembers}
                searchQuery={memberHook.searchQuery}
                onSearchChange={memberHook.setSearchQuery}
                selectedTeam={memberHook.selectedTeam}
                onSelectTeam={memberHook.setSelectedTeam}
                sortBy={memberHook.sortBy}
                onSortChange={memberHook.setSortBy}
                memberStats={memberHook.memberStats}
                onOpenAddMember={handleOpenAddMember}
                onViewMember={(member) => setViewingMember(member)}
                onEditMember={handleOpenEditMember}
                onDeleteMember={handleDeleteMember}
              />
            )}

            {/* View 3: Events Lineup */}
            {currentView === 'events' && (
              <EventsView
                events={eventHook.events}
                filteredEvents={eventHook.filteredEvents}
                searchQuery={eventHook.searchQuery}
                onSearchChange={eventHook.setSearchQuery}
                statusFilter={eventHook.statusFilter}
                onStatusFilterChange={eventHook.setStatusFilter}
                modeFilter={eventHook.modeFilter}
                onModeFilterChange={eventHook.setModeFilter}
                viewMode={eventHook.viewMode}
                onViewModeChange={eventHook.setViewMode}
                eventStats={eventHook.eventStats}
                onOpenCreateEvent={handleOpenCreateEvent}
                onViewEvent={(event) => setViewingEvent(event)}
                onEditEvent={handleOpenEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {/* View 4: Announcements */}
            {currentView === 'announcements' && (
              <AnnouncementsView
                announcements={announcementHook.announcements}
                onBroadcast={handleBroadcastAnnouncement}
              />
            )}

            {/* View 5: Magazine Archive */}
            {currentView === 'magazine' && (
              <MagazineView
                magazines={magazineHook.magazines}
                filteredMagazines={magazineHook.filteredMagazines}
                selectedYear={magazineHook.selectedYear}
                onSelectYear={magazineHook.setSelectedYear}
                searchQuery={magazineHook.searchQuery}
                onSearchChange={magazineHook.setSearchQuery}
                magazineStats={magazineHook.magazineStats}
                onOpenUploadModal={handleOpenUploadMagazine}
                onOpenEditModal={handleOpenEditMagazine}
                onOpenPdfViewer={(mag) => {
                  magazineHook.trackDownload(mag.id);
                  magazineHook.setViewingPdfMagazine(mag);
                }}
                onDeleteMagazine={handleDeleteMagazine}
              />
            )}

          </main>
        </div>

        {/* Global Footer */}
        <footer className="px-8 py-6 text-center border-t border-white/10 text-xs leading-4 opacity-70 font-bold">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span className="font-extrabold">© 2026-2027 ACES Club — Association of Computer Engineering Students</span>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold btn-secondary">
                {themeDisplayNames[theme] || 'Deep Midnight'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold btn-secondary">
                React 19
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold btn-secondary">
                Tailwind 4.3
              </span>
            </div>
          </div>
        </footer>

      </div>

      {/* Global Modals */}
      
      {/* 1. Member Add/Edit Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        initialMember={editingMember}
        onClose={() => {
          setIsMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSubmit={handleSaveMember}
      />

      {/* 2. Member Detail Drawer */}
      <MemberDetailModal
        isOpen={Boolean(viewingMember)}
        member={viewingMember}
        onClose={() => setViewingMember(null)}
        onEdit={(mem) => {
          setViewingMember(null);
          handleOpenEditMember(mem);
        }}
      />

      {/* 3. Event Create/Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        initialEvent={editingEvent}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSaveEvent}
      />

      {/* 4. Event Detail Modal */}
      <EventDetailModal
        isOpen={Boolean(viewingEvent)}
        event={viewingEvent}
        onClose={() => setViewingEvent(null)}
        onEdit={(evt) => {
          setViewingEvent(null);
          handleOpenEditEvent(evt);
        }}
      />

      {/* 5. Magazine Upload/Edit Modal */}
      <MagazineModal
        isOpen={isMagazineModalOpen}
        initialMagazine={editingMagazine}
        onClose={() => {
          setIsMagazineModalOpen(false);
          setEditingMagazine(null);
        }}
        onSubmit={handleSaveMagazine}
      />

      {/* 6. Magazine PDF Viewer & Download Modal */}
      <MagazinePdfModal
        isOpen={Boolean(magazineHook.viewingPdfMagazine)}
        magazine={magazineHook.viewingPdfMagazine}
        onClose={() => magazineHook.setViewingPdfMagazine(null)}
        onDownload={magazineHook.trackDownload}
      />

      {/* 7. Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      {/* 8. Toast Feedback Alerts */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}

export default App;
