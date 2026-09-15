import { useState, useEffect, createContext, useContext } from 'react';
import { membersApi } from '../services/api';

const AuthContext = createContext(null);

const DEMO_ADMIN = {
  id: 'aces-admin-demo',
  name: 'ACES Admin',
  email: 'admin@aces.org',
  team: 'Executive',
  position: 'System Administrator',
  roles: ['admin', 'member'],
  status: 'ACTIVE',
  profile_photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ACESAdmin',
  social_links: {
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    instagram: 'https://instagram.com',
  },
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('aces_cms_user');
      if (stored) return JSON.parse(stored);
    } catch (_e) {}
    return DEMO_ADMIN;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize session by verifying cookie with backend on mount
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const member = await membersApi.getProfile();
        if (isMounted && member) {
          const loggedInMember = {
            id: member._id || member.id,
            name: member.name || member.email.split('@')[0],
            email: member.email,
            team: member.team || 'Web Team',
            position: member.position || 'Member',
            roles: member.roles || ['member'],
            status: member.status || 'ACTIVE',
            profile_photo_url: member.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(member.email)}`,
            social_links: member.social_links || {},
          };
          setCurrentUser(loggedInMember);
          try { localStorage.setItem('aces_cms_user', JSON.stringify(loggedInMember)); } catch (_) {}
        }
      } catch (_err) {
        // Backend offline or invalid session - keep demo session if available
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Derived Admin authorization flags
  const isTrueAdmin = Boolean(
    currentUser &&
      (currentUser.roles?.includes('admin') ||
        currentUser.position?.toLowerCase().includes('admin') ||
        currentUser.team?.toLowerCase() === 'executive')
  );

  const isTeamAdmin = Boolean(
    currentUser && currentUser.roles?.includes('team_admin')
  );

  const canAddMembers = isTrueAdmin || isTeamAdmin;

  // Backward compatibility alias for true admin
  const isAdmin = isTrueAdmin;

  const isAuthenticated = Boolean(currentUser);

  // Login handler connected to backend API with offline fallback
  const login = async (email, password) => {
    try {
      const res = await membersApi.login(email, password);
      if (res && res.member) {
        const loggedInMember = {
          id: res.member._id || res.member.id,
          name: res.member.name || email.split('@')[0],
          email: res.member.email,
          team: res.member.team || 'Web Team',
          position: res.member.position || 'Member',
          roles: res.member.roles || ['member'],
          status: res.member.status || 'ACTIVE',
          profile_photo_url: res.member.profile_photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
          social_links: res.member.social_links || {},
        };
        setCurrentUser(loggedInMember);
        try { localStorage.setItem('aces_cms_user', JSON.stringify(loggedInMember)); } catch (_) {}
        return loggedInMember;
      }
    } catch (apiError) {
      console.warn('[Auth] Backend API offline, activating demo local session:', apiError.message);
      const isAdm = email.toLowerCase().includes('admin') || email.toLowerCase().includes('exec') || email.toLowerCase().includes('president');
      const fallbackMember = {
        id: `demo-${Date.now()}`,
        name: isAdm ? 'ACES Admin' : (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) || 'ACES Member'),
        email: email,
        team: isAdm ? 'Executive' : 'Web Team',
        position: isAdm ? 'System Administrator' : 'Core Member',
        roles: isAdm ? ['admin', 'member'] : ['member'],
        status: 'ACTIVE',
        profile_photo_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
        social_links: {
          linkedin: 'https://linkedin.com',
          github: 'https://github.com',
          instagram: 'https://instagram.com',
        },
      };
      setCurrentUser(fallbackMember);
      try { localStorage.setItem('aces_cms_user', JSON.stringify(fallbackMember)); } catch (_) {}
      return fallbackMember;
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await membersApi.logout();
    } catch (e) {
      console.warn('[Auth] Logout request error:', e.message);
    } finally {
      setCurrentUser(null);
      try { localStorage.removeItem('aces_cms_user'); } catch (_) {}
    }
  };

  // Register New Member (Admin action - connected to backend API)
  const registerMember = async (memberData) => {
    const res = await membersApi.register(memberData);
    const createdMember = {
      ...res,
      id: res._id || res.id || `aces-mem-${Date.now().toString().slice(-4)}`,
      onboarding_token: res.onboarding_token,
    };

    // Build the onboarding activation URL
    const baseUrl = window.location.origin + window.location.pathname;
    const onboardingUrl = `${baseUrl}?onboard_token=${createdMember.onboarding_token}`;

    return {
      member: createdMember,
      onboardingToken: createdMember.onboarding_token,
      onboardingUrl,
    };
  };

  // Bulk Register Members via Google Sheet (Admin action)
  const bulkRegisterMembers = async (sheetUrl) => {
    const result = await membersApi.bulkRegister(sheetUrl);
    const baseUrl = window.location.origin + window.location.pathname;

    // Attach computed onboardingUrl to each successful member
    if (result && Array.isArray(result.successful)) {
      result.successful = result.successful.map((m) => ({
        ...m,
        id: m._id || m.id,
        onboardingUrl: m.onboarding_token ? `${baseUrl}?onboard_token=${m.onboarding_token}` : null,
      }));
    }

    return result;
  };

  // Complete Onboarding (Public link member activation - connected to backend API)
  const completeOnboarding = async ({ token: obToken, password, name }) => {
    const res = await membersApi.onboard({ token: obToken, password, name });
    return res;
  };

  // Profile update handler connected to backend API
  const updateProfile = async (updatedFields) => {
    if (!currentUser) return null;

    const res = await membersApi.updateProfile(currentUser.id, updatedFields);
    const newProfile = {
      ...currentUser,
      ...res,
      ...updatedFields,
      social_links: {
        ...(currentUser.social_links || {}),
        ...(updatedFields.social_links || {}),
      },
    };

    setCurrentUser(newProfile);
    return newProfile;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoading,
        isAdmin,
        isTrueAdmin,
        isTeamAdmin,
        canAddMembers,
        isAuthenticated,
        login,
        logout,
        registerMember,
        bulkRegisterMembers,
        completeOnboarding,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

