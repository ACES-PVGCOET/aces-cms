import { useState, useEffect } from 'react';
import './App.css';

// Hooks
import { useAuth, AuthProvider } from './hooks/useAuth';
import { useMembers } from './hooks/useMembers';
import { useEvents } from './hooks/useEvents';
import { useAnnouncements } from './hooks/useAnnouncements';
import { useShowcase } from './hooks/useShowcase';
import { useForms } from './hooks/useForms';

// Utilities
import { 
  downloadJSON, 
  formatPublicEvents, 
  formatPublicMembers, 
  syncToPublicWebsite 
} from './utils/websiteConnector';

// Core Components
import SidebarNavigation from './components/SidebarNavigation';
import TopHeader from './components/TopHeader';
import DashboardView from './components/DashboardView';
import MembersView from './components/MembersView';
import EventsView from './components/EventsView';
import AnnouncementsView from './components/AnnouncementsView';
import ShowcaseView from './components/ShowcaseView';
import FormsView from './components/FormsView';
import AdminPanelView from './components/AdminPanelView';

// Modals & Auxiliary Elements
import MemberModal from './components/MemberModal';
import MemberDetailModal from './components/MemberDetailModal';
import RegisterMemberModal from './components/RegisterMemberModal';
import BatchRegisterModal from './components/BatchRegisterModal';
import OnboardingModal from './components/OnboardingModal';
import LoginModal from './components/LoginModal';
import LoginPage from './components/LoginPage';
import ProfileModal from './components/ProfileModal';
import EventModal from './components/EventModal';
import EventDetailModal from './components/EventDetailModal';
import ShowcaseItemModal from './components/ShowcaseItemModal';
import ShowcaseRenameModal from './components/ShowcaseRenameModal';
import ShowcasePdfModal from './components/ShowcasePdfModal';
import FormBuilderModal from './components/FormBuilderModal';
import FormSubmitModal from './components/FormSubmitModal';
import Toast from './components/Toast';

/**
 * Inner Application Content connected to Auth Context
 */
function AppContent() {
  // Auth Context
  const { 
    currentUser, 
    isLoading,
    isAdmin, 
    isTrueAdmin,
    isTeamAdmin,
    canAddMembers,
    login, 
    logout, 
    registerMember, 
    bulkRegisterMembers,
    completeOnboarding, 
    updateProfile 
  } = useAuth();

  // Theme State with fallback & localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('aces_cms_theme_3');
      if (['deep-midnight', 'pastel-aurora'].includes(stored)) {
        return stored;
      }
      return 'pastel-aurora';
    } catch {
      return 'pastel-aurora';
    }
  });

  const handleSelectTheme = (newTheme) => {
    if (['deep-midnight', 'pastel-aurora'].includes(newTheme)) {
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
  const showcaseHook = useShowcase();
  const formsHook = useForms();

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

  // Auth & Workflow Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBatchRegisterModalOpen, setIsBatchRegisterModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [onboardingToken, setOnboardingToken] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);

  const [isMagazineModalOpen, setIsMagazineModalOpen] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState(null);

  // Forms Modals
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [isFormSubmitOpen, setIsFormSubmitOpen] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(null);

  // Auto-detect ?onboard_token or ?form_id parameter in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('onboard_token') || params.get('token');
    if (token) {
      setOnboardingToken(token);
      setIsOnboardingModalOpen(true);
    }

    const formIdParam = params.get('form_id') || params.get('form');
    if (formIdParam) {
      formsHook.fetchFormById(formIdParam).then((f) => {
        setSubmittingForm(f);
        setIsFormSubmitOpen(true);
      }).catch(() => {});
    }
  }, []);

  // Synchronize global search with active view
  const handleGlobalSearchChange = (query) => {
    setGlobalSearch(query);
    memberHook.setSearchQuery(query);
    eventHook.setSearchQuery(query);
    showcaseHook.setSearchQuery(query);
    formsHook.setSearchQuery(query);
  };

  // --- AUTH WORKFLOW HANDLERS ---
  const handleRegisterMemberSubmit = async (memberData) => {
    const result = await registerMember(memberData);
    // Sync newly registered member to active member directory
    if (result && result.member) {
      memberHook.addMember({
        ...result.member,
        status: 'NOT_ACTIVE',
      });
    }
    showToast(`New recruit registered. Onboarding link generated.`, 'success', 'Member Registered');
    return result;
  };

  const handleBatchRegisterSubmit = async (sheetUrl) => {
    const result = await bulkRegisterMembers(sheetUrl);
    if (result && Array.isArray(result.successful) && result.successful.length > 0) {
      result.successful.forEach((m) => {
        memberHook.addMember({
          ...m,
          status: 'NOT_ACTIVE',
        });
      });
    }
    showToast(
      `Batch import process complete: ${result.successfulCount || 0} registered, ${result.failedCount || 0} failed.`,
      (result.successfulCount || 0) > 0 ? 'success' : 'error',
      'Batch Registration'
    );
    return result;
  };

  const handleCompleteOnboardingSubmit = async (onboardPayload) => {
    const activated = await completeOnboarding(onboardPayload);
    showToast(`Account successfully activated! Please log in to continue.`, 'success', 'Account Activated');
    
    // Clean up URL search parameter if present
    if (window.history.replaceState) {
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
    }
    return activated;
  };

  const handleLoginSubmit = async (email, password) => {
    const loggedUser = await login(email, password);
    showToast(`Logged in as ${loggedUser.name} (${loggedUser.position}).`, 'success', 'Welcome Back');
  };

  const handleLogoutSubmit = () => {
    logout();
    showToast('Logged out from ACES session.', 'info', 'Session Ended');
  };

  const handleSaveProfileSubmit = async (updates) => {
    const updated = await updateProfile(updates);
    if (updated) {
      memberHook.updateMember(updated.id, updated);
      showToast('Profile information successfully updated.', 'success', 'Profile Saved');
    }
  };

  // --- MEMBER HANDLERS ---
  const handleOpenAddMember = () => {
    if (canAddMembers) {
      setIsRegisterModalOpen(true);
    } else {
      setEditingMember(null);
      setIsMemberModalOpen(true);
    }
  };

  const handleOpenEditMember = (member) => {
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (formData) => {
    try {
      if (editingMember) {
        await memberHook.updateMember(editingMember.id, formData);
        showToast(`Member profile for "${formData.name}" updated.`, 'success', 'Member Updated');
      } else {
        await memberHook.addMember(formData);
        showToast(`New recruit "${formData.name}" enrolled into ${formData.team}.`, 'success', 'Member Added');
      }
      setIsMemberModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      showToast(err.message || 'Failed to save member profile.', 'error', 'API Error');
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from ACES directory?`)) {
      try {
        await memberHook.deleteMember(id);
        showToast(`Member "${name}" was removed from the registry.`, 'info', 'Member Removed');
        if (viewingMember?.id === id) setViewingMember(null);
      } catch (err) {
        showToast(err.message || `Failed to remove member "${name}".`, 'error', 'API Error');
      }
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

  const handleSaveEvent = async (formData) => {
    try {
      if (editingEvent) {
        await eventHook.updateEvent(editingEvent.id, formData);
        showToast(`Event "${formData.overview}" updated.`, 'success', 'Event Updated');
      } else {
        await eventHook.createEvent(formData);
        showToast(`New event "${formData.overview}" created.`, 'success', 'Event Created');
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      showToast(err.message || 'Failed to save event.', 'error', 'API Error');
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await eventHook.deleteEvent(id);
        showToast(`Event "${title}" has been deleted.`, 'info', 'Event Deleted');
        if (viewingEvent?.id === id) setViewingEvent(null);
      } catch (err) {
        showToast(err.message || `Failed to delete event "${title}".`, 'error', 'API Error');
      }
    }
  };

  // --- SHOWCASE HANDLERS ---
  const handleOpenAddShowcaseMedia = () => {
    showcaseHook.setEditingItem(null);
    showcaseHook.setIsAddModalOpen(true);
  };

  const handleOpenEditShowcaseMedia = (item) => {
    showcaseHook.setEditingItem(item);
    showcaseHook.setIsAddModalOpen(true);
  };

  const handleSaveShowcaseMedia = async (formData) => {
    try {
      if (showcaseHook.editingItem) {
        await showcaseHook.updateMediaItem(showcaseHook.editingItem.id, formData);
        showToast(`Media item "${formData.title}" updated.`, 'success', 'Item Updated');
      } else {
        await showcaseHook.addMediaItem(formData);
        showToast(`"${formData.title}" added to collection '${formData.collection_name}'.`, 'success', 'Media Published');
      }
      showcaseHook.setIsAddModalOpen(false);
      showcaseHook.setEditingItem(null);
    } catch (err) {
      showToast(err.message || 'Failed to save showcase media item.', 'error', 'API Error');
    }
  };

  const handleDeleteShowcaseMedia = async (id) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      try {
        await showcaseHook.deleteMediaItem(id);
        showToast('Media item removed from showcase collection.', 'info', 'Item Deleted');
      } catch (err) {
        showToast(err.message || 'Failed to delete media item.', 'error', 'API Error');
      }
    }
  };

  const handleRenameCollection = async (oldName, newName) => {
    try {
      await showcaseHook.renameCollection(oldName, newName);
      showToast(`Collection renamed to '${newName}'.`, 'success', 'Collection Renamed');
    } catch (err) {
      showToast(err.message || 'Failed to rename collection.', 'error', 'API Error');
    }
  };

  // --- SYNC & EXPORT HANDLERS ---
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

  const handleBroadcastAnnouncement = async (annData) => {
    try {
      await announcementHook.addAnnouncement(annData);
      showToast(`Announcement "${annData.topic || annData.title}" broadcasted to public feeds.`, 'success', 'Broadcast Created');
    } catch (err) {
      showToast(err.message || 'Failed to broadcast announcement.', 'error', 'API Error');
    }
  };

  const handleDeleteAnnouncement = async (id, topic) => {
    if (window.confirm(`Are you sure you want to delete the announcement "${topic}"?`)) {
      try {
        await announcementHook.deleteAnnouncement(id);
        showToast(`Announcement "${topic}" has been removed.`, 'info', 'Notice Deleted');
      } catch (err) {
        showToast(err.message || `Failed to delete announcement "${topic}".`, 'error', 'API Error');
      }
    }
  };

  // --- FORMS HANDLERS ---
  const handleOpenCreateForm = () => {
    setEditingForm(null);
    setIsFormBuilderOpen(true);
  };

  const handleOpenEditForm = async (formSummary) => {
    try {
      const formId = formSummary.id || formSummary.form_id;
      const fullForm = await formsHook.fetchFormById(formId);
      setEditingForm(fullForm);
      setIsFormBuilderOpen(true);
    } catch (err) {
      showToast(err.message || 'Failed to fetch form details for editing.', 'error', 'API Error');
    }
  };

  const handleOpenSubmitForm = async (formSummary) => {
    try {
      const formId = typeof formSummary === 'string' ? formSummary : (formSummary.id || formSummary.form_id);
      const fullForm = await formsHook.fetchFormById(formId);
      setSubmittingForm(fullForm);
      setIsFormSubmitOpen(true);
    } catch (err) {
      showToast(err.message || 'Failed to load form questions.', 'error', 'API Error');
    }
  };

  const handleSaveForm = async (formData) => {
    try {
      if (editingForm) {
        await formsHook.updateForm(editingForm.id || editingForm.form_id, formData);
        showToast(`Form "${formData.title}" schema updated.`, 'success', 'Form Updated');
      } else {
        const created = await formsHook.createForm(formData);
        showToast(`Form "${formData.title}" created. Form ID: ${created.id}`, 'success', 'Form Published');
      }
      setIsFormBuilderOpen(false);
      setEditingForm(null);
    } catch (err) {
      showToast(err.message || 'Failed to save form schema.', 'error', 'API Error');
    }
  };

  const handleDeleteForm = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete form "${title}" and all its submitted responses?`)) {
      try {
        await formsHook.deleteForm(id);
        showToast(`Form "${title}" deleted.`, 'info', 'Form Deleted');
      } catch (err) {
        showToast(err.message || `Failed to delete form "${title}".`, 'error', 'API Error');
      }
    }
  };

  const handleSubmitFormResponse = async (formId, answers, email) => {
    const res = await formsHook.submitResponse(formId, answers, email);
    showToast('Form response submitted successfully!', 'success', 'Response Saved');
    return res;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold tracking-wide uppercase opacity-75">Authenticating session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <>
        <LoginPage
          onLogin={handleLoginSubmit}
          onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
          hasOnboardingToken={Boolean(onboardingToken)}
        />
        <OnboardingModal
          isOpen={isOnboardingModalOpen}
          token={onboardingToken}
          onClose={() => setIsOnboardingModalOpen(false)}
          onCompleteOnboarding={handleCompleteOnboardingSubmit}
          onOpenLogin={() => {}}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  return (
    <div className={`aces-canvas theme-${theme} min-h-screen relative flex font-sans`}>
      
      {/* 1. Fixed Left Sidebar Navigation */}
      <SidebarNavigation
        currentView={currentView}
        onSelectView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isTrueAdmin={isTrueAdmin}
        counts={{
          members: memberHook.members.length,
          events: eventHook.events.filter((e) => e.status === 'Scheduled' || e.status === 'Live').length,
          showcaseCollections: showcaseHook.collections.length,
          forms: formsHook.forms.length,
        }}
      />

      {/* 2. Main Content Area */}
      <div className="pl-64 lg:pl-72 w-full min-h-screen flex flex-col justify-between min-w-0">
        
        <div>
          {/* Top Header Bar with Auth Session Controls */}
          <TopHeader
            searchQuery={globalSearch}
            onSearchChange={handleGlobalSearchChange}
            currentTheme={theme}
            onSelectTheme={handleSelectTheme}
            user={currentUser}
            isAdmin={isAdmin}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onLogout={handleLogoutSubmit}
          />

          {/* Active View Container */}
          <main className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 max-w-7xl mx-auto w-full">
            
            {/* View 1: Launchpad Dashboard */}
            {currentView === 'dashboard' && (
              <DashboardView
                members={memberHook.members}
                events={eventHook.events}
                isAdmin={isAdmin}
                onNavigate={setCurrentView}
                onOpenAddMember={handleOpenAddMember}
                onOpenCreateEvent={handleOpenCreateEvent}
                onOpenBroadcast={() => setCurrentView('announcements')}
                onOpenUploadMagazine={handleOpenAddShowcaseMedia}
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
                isAdmin={isAdmin}
                canAddMembers={canAddMembers}
                onOpenAddMember={handleOpenAddMember}
                onOpenBatchRegister={() => setIsBatchRegisterModalOpen(true)}
                onViewMember={(member) => setViewingMember(member)}
                onEditMember={handleOpenEditMember}
                onDeleteMember={handleDeleteMember}
              />
            )}

            {/* View 2b: Admin Panel (True Admin Only) */}
            {currentView === 'admin-panel' && (
              <AdminPanelView
                members={memberHook.members}
                isTrueAdmin={isTrueAdmin}
                onUpdateMember={memberHook.updateMember}
                showToast={showToast}
              />
            )}

            {/* View 3: Events Lineup */}
            {currentView === 'events' && (
              <EventsView
                filteredEvents={eventHook.filteredEvents}
                searchQuery={eventHook.searchQuery}
                onSearchChange={eventHook.setSearchQuery}
                highlightFilter={eventHook.highlightFilter}
                onHighlightFilterChange={eventHook.setHighlightFilter}
                viewMode={eventHook.viewMode}
                onViewModeChange={eventHook.setViewMode}
                eventStats={eventHook.eventStats}
                onOpenCreateEvent={handleOpenCreateEvent}
                onViewEvent={(event) => setViewingEvent(event)}
                onEditEvent={handleOpenEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {/* View 4: Forms Engine */}
            {currentView === 'forms' && (
              <FormsView
                forms={formsHook.forms}
                filteredForms={formsHook.filteredForms}
                searchQuery={formsHook.searchQuery}
                onSearchChange={formsHook.setSearchQuery}
                statusFilter={formsHook.statusFilter}
                onStatusFilterChange={formsHook.setStatusFilter}
                formStats={formsHook.formStats}
                activeForm={formsHook.activeForm}
                onSelectForm={formsHook.fetchFormById}
                onClearActiveForm={() => formsHook.setActiveForm(null)}
                activeFormResponses={formsHook.activeFormResponses}
                onFetchResponses={formsHook.fetchFormResponses}
                onOpenCreateModal={handleOpenCreateForm}
                onOpenEditModal={handleOpenEditForm}
                onOpenSubmitModal={handleOpenSubmitForm}
                onDeleteForm={handleDeleteForm}
                onExportCSV={formsHook.exportToCSV}
                onFetchById={handleOpenSubmitForm}
                isLoading={formsHook.isLoading}
                isResponsesLoading={formsHook.isResponsesLoading}
              />
            )}

            {/* View 5: Announcements */}
            {currentView === 'announcements' && (
              <AnnouncementsView
                announcements={announcementHook.announcements}
                onBroadcast={handleBroadcastAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            )}

            {/* View 6: Media Showcase */}
            {currentView === 'showcase' && (
              <ShowcaseView
                collections={showcaseHook.collections}
                filteredCollections={showcaseHook.filteredCollections}
                activeCollection={showcaseHook.activeCollection}
                onSelectCollection={showcaseHook.setActiveCollection}
                currentCollectionObject={showcaseHook.currentCollectionObject}
                activeCollectionItems={showcaseHook.activeCollectionItems}
                searchQuery={showcaseHook.searchQuery}
                onSearchChange={showcaseHook.setSearchQuery}
                mediaTypeFilter={showcaseHook.mediaTypeFilter}
                onMediaTypeFilterChange={showcaseHook.setMediaTypeFilter}
                showcaseStats={showcaseHook.showcaseStats}
                onOpenAddModal={handleOpenAddShowcaseMedia}
                onOpenEditModal={handleOpenEditShowcaseMedia}
                onOpenRenameModal={(colName) => showcaseHook.setRenamingCollectionName(colName)}
                onOpenPdfModal={(pdfItem) => showcaseHook.setViewingPdfItem(pdfItem)}
                onDeleteItem={handleDeleteShowcaseMedia}
              />
            )}

          </main>
        </div>

        {/* Global Footer */}
        <footer className="px-8 py-6 text-center border-t border-white/10 text-xs leading-4 opacity-70 font-bold">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <span className="font-extrabold">© 2026-2027 ACES Club — Association of Computer Engineering Students</span>
          </div>
        </footer>

      </div>

      {/* Global Modals & Authentication Workflows */}
      
      {/* 1. Admin Member Registration Modal */}
      <RegisterMemberModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterMemberSubmit}
        currentUser={currentUser}
        onStartOnboarding={(token) => {
          setOnboardingToken(token);
          setIsOnboardingModalOpen(true);
        }}
      />

      {/* 1b. Admin Google Sheet Batch Registration Modal */}
      <BatchRegisterModal
        isOpen={isBatchRegisterModalOpen}
        onClose={() => setIsBatchRegisterModalOpen(false)}
        onBulkRegister={handleBatchRegisterSubmit}
        onStartOnboarding={(token) => {
          setOnboardingToken(token);
          setIsOnboardingModalOpen(true);
        }}
      />

      {/* 2. Member Onboarding Activation Modal */}
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        token={onboardingToken}
        onClose={() => setIsOnboardingModalOpen(false)}
        onCompleteOnboarding={handleCompleteOnboardingSubmit}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* 3. Member Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginSubmit}
      />

      {/* 4. Member Profile Edit Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        user={currentUser}
        isAdmin={isAdmin}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={handleSaveProfileSubmit}
      />

      {/* 5. Member Edit/Add Modal */}
      <MemberModal
        isOpen={isMemberModalOpen}
        initialMember={editingMember}
        onClose={() => {
          setIsMemberModalOpen(false);
          setEditingMember(null);
        }}
        onSubmit={handleSaveMember}
      />

      {/* 6. Member Detail Drawer */}
      <MemberDetailModal
        isOpen={Boolean(viewingMember)}
        member={viewingMember}
        onClose={() => setViewingMember(null)}
        onEdit={(mem) => {
          setViewingMember(null);
          handleOpenEditMember(mem);
        }}
      />

      {/* 7. Event Create/Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        initialEvent={editingEvent}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSaveEvent}
      />

      {/* 8. Event Detail Modal */}
      <EventDetailModal
        isOpen={Boolean(viewingEvent)}
        event={viewingEvent}
        onClose={() => setViewingEvent(null)}
        onEdit={(evt) => {
          setViewingEvent(null);
          handleOpenEditEvent(evt);
        }}
        onDelete={handleDeleteEvent}
      />

      {/* 9. Showcase Item Add/Edit Modal */}
      <ShowcaseItemModal
        isOpen={showcaseHook.isAddModalOpen}
        editingItem={showcaseHook.editingItem}
        initialCollection={showcaseHook.activeCollection || ''}
        existingCollections={showcaseHook.collections}
        onClose={() => {
          showcaseHook.setIsAddModalOpen(false);
          showcaseHook.setEditingItem(null);
        }}
        onSubmit={handleSaveShowcaseMedia}
      />

      {/* 10. Showcase Rename Collection Modal */}
      <ShowcaseRenameModal
        isOpen={Boolean(showcaseHook.renamingCollectionName)}
        collectionName={showcaseHook.renamingCollectionName}
        onClose={() => showcaseHook.setRenamingCollectionName(null)}
        onSubmit={handleRenameCollection}
      />

      {/* 11. Showcase PDF Document Modal */}
      <ShowcasePdfModal
        isOpen={Boolean(showcaseHook.viewingPdfItem)}
        item={showcaseHook.viewingPdfItem}
        onClose={() => showcaseHook.setViewingPdfItem(null)}
      />

      {/* 12. Form Builder Modal */}
      <FormBuilderModal
        isOpen={isFormBuilderOpen}
        initialForm={editingForm}
        onClose={() => {
          setIsFormBuilderOpen(false);
          setEditingForm(null);
        }}
        onSubmit={handleSaveForm}
      />

      {/* 13. Form Submit / Preview Modal */}
      <FormSubmitModal
        isOpen={isFormSubmitOpen}
        form={submittingForm}
        onClose={() => {
          setIsFormSubmitOpen(false);
          setSubmittingForm(null);
        }}
        onSubmitResponse={handleSubmitFormResponse}
      />

      {/* 14. Toast Feedback Alerts */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}

/**
 * Root App Component wrapped in AuthProvider
 */
export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
