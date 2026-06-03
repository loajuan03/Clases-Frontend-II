import { createContext, useEffect, useState } from 'react';

import authService from '../services/authService';
import { AUTH_SESSION_CLEARED_EVENT, SESSION_STORAGE_KEY } from '../utils/authStorage';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(authService.getSessionUser);
  const [authError, setAuthError] = useState('');
  const [isHydratingSession, setIsHydratingSession] = useState(true);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      setIsHydratingSession(true);

      try {
        const result = await authService.hydrateSession();

        if (!isMounted) {
          return;
        }

        setCurrentUser(result.user ?? null);
      } finally {
        if (isMounted) {
          setIsHydratingSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const clearExpiredSession = () => {
      setCurrentUser(null);
      setAuthError('Tu sesión expiró. Inicia sesión nuevamente.');
    };

    const handleStorage = (event) => {
      if (event.key === SESSION_STORAGE_KEY && !event.newValue) {
        clearExpiredSession();
      }
    };

    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, clearExpiredSession);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, clearExpiredSession);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const register = async (payload) => {
    setIsSubmittingAuth(true);
    setAuthError('');

    const result = await authService.register(payload);

    if (result.ok) {
      setCurrentUser(result.user);
    } else {
      setAuthError(result.error ?? 'No fue posible crear la cuenta.');
    }

    setIsSubmittingAuth(false);

    return result;
  };

  const login = async (payload) => {
    setIsSubmittingAuth(true);
    setAuthError('');

    const result = await authService.login(payload);

    if (result.ok) {
      setCurrentUser(result.user);
    } else {
      setAuthError(result.error ?? 'No fue posible iniciar sesión.');
    }

    setIsSubmittingAuth(false);

    return result;
  };

  const logout = async () => {
    setAuthError('');
    await authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (updates) => {
    setAuthError('');

    const result = await authService.updateProfile(currentUser?.id, updates);

    if (result.ok && result.user) {
      setCurrentUser(result.user);
    } else if (!result.ok) {
      setAuthError(result.error ?? 'No fue posible actualizar el perfil.');
    }

    return result;
  };

  const changePassword = async (currentPassword, newPassword) => {
    setAuthError('');

    const result = await authService.changePassword(currentUser?.id, currentPassword, newPassword);

    if (result.ok && result.user) {
      setCurrentUser(result.user);
    } else if (!result.ok) {
      setAuthError(result.error ?? 'No fue posible cambiar la contraseña.');
    }

    return result;
  };

  const clearAuthError = () => {
    setAuthError('');
  };

  const value = {
    authError,
    clearAuthError,
    changePassword,
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 'ADMIN',
    isHydratingSession,
    isSubmittingAuth,
    login,
    logout,
    register,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
