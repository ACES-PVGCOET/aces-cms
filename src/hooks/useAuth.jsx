import { useState, useEffect, createContext, useContext } from 'react';
import { membersApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
        }
      } catch (_err) {
        // Session invalid or expired cookie
        if (isMounted) {
          setCurrentUser(null);
        }
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

  // Derived Admin authorization flag
  const isAdmin = Boolean(
    currentUser &&
      (currentUser.roles?.includes('admin') ||
        currentUser.position?.toLowerCase().includes('admin') ||
        currentUser.team?.toLowerCase() === 'executive')
  );

  const isAuthenticated = Boolean(currentUser);

  // Login handler connected to backend API
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
        return loggedInMember;
      }
    } catch (apiError) {
      console.warn('[Auth] Backend API login error:', apiError.message);
      throw apiError;
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

