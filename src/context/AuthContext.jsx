import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, LOCAL_KEYS } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize users & session
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch profile role from supabase profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            fullName: profile?.full_name || session.user.user_metadata?.full_name || 'Guest User',
            role: profile?.role || 'customer',
            isGoogleLinked: profile?.is_google_linked || false,
            avatar: session.user.user_metadata?.avatar_url || null,
          });
        }
      } else {
        // LocalStorage Dual-Mode
        const existingUsers = JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
        if (existingUsers.length === 0) {
          // Seed standard default accounts for easy demo
          const defaultAccounts = [
            {
              id: 'superadmin_1',
              email: 'superadmin@agency.com',
              password: 'admin',
              fullName: 'Agency SuperAdmin',
              role: 'superadmin',
              isGoogleLinked: false,
            },
            {
              id: 'owner_1',
              email: 'owner@royalgrand.com',
              password: 'owner',
              fullName: 'Mahipal Singh (Hotel Owner)',
              role: 'admin',
              isGoogleLinked: false,
            }
          ];
          localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(defaultAccounts));
        }

        const savedSession = JSON.parse(localStorage.getItem(LOCAL_KEYS.CURRENT_SESSION) || 'null');
        if (savedSession) {
          setCurrentUser(savedSession);
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if an email exists in users list
   */
  const checkLocalEmailExists = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
    return users.some((u) => u.email.toLowerCase() === cleanEmail);
  };

  /**
   * Login with Email & Password
   */
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) {
        return { success: false, notFound: false, message: error.message };
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.full_name || 'Guest User',
        role: profile?.role || 'customer',
        isGoogleLinked: profile?.is_google_linked || false,
      };
      setCurrentUser(userObj);
      return { success: true, user: userObj };
    } else {
      // Local Dual-Mode
      const users = JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!user || user.password !== password) {
        return {
          success: false,
          notFound: false,
          message: 'Galat Password! Kripya sahi password enter karein.',
        };
      }

      const sessionObj = {
        id: user.id,
        email: user.email,
        fullName: user.fullName || user.email.split('@')[0],
        role: user.role || 'customer',
        isGoogleLinked: user.isGoogleLinked || false,
        linkedGoogleEmail: user.linkedGoogleEmail || null,
      };

      localStorage.setItem(LOCAL_KEYS.CURRENT_SESSION, JSON.stringify(sessionObj));
      setCurrentUser(sessionObj);
      return { success: true, user: sessionObj };
    }
  };

  /**
   * Sign Up new account
   */
  const signup = async (email, password, fullName, role = 'customer') => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        return { success: false, message: error.message };
      }
      if (data?.user) {
        const userObj = {
          id: data.user.id,
          email: cleanEmail,
          fullName,
          role: 'customer',
          isGoogleLinked: false,
        };
        setCurrentUser(userObj);
        return { success: true, user: userObj };
      }
    } else {
      if (checkLocalEmailExists(cleanEmail)) {
        return {
          success: false,
          message: 'Ye email pehle se registered hai! Kripya Login karein.',
        };
      }

      // Local Storage
      const users = JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
      const newUser = {
        id: `user_${Date.now()}`,
        email: cleanEmail,
        password,
        fullName: fullName || cleanEmail.split('@')[0],
        role,
        isGoogleLinked: false,
      };

      users.push(newUser);
      localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));

      const sessionObj = {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        isGoogleLinked: false,
      };
      localStorage.setItem(LOCAL_KEYS.CURRENT_SESSION, JSON.stringify(sessionObj));
      setCurrentUser(sessionObj);
      return { success: true, user: sessionObj };
    }
  };

  /**
   * Google Sign-in with selectable role ('admin' for owner, 'customer' for guest)
   */
  const loginWithGoogle = async (customGoogleEmail = null, customName = null, requestedRole = 'admin') => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) return { success: false, message: error.message };
      return { success: true };
    } else {
      // Local Dual Mode 1-click Google Sign-in
      const googleEmail = (customGoogleEmail || 'owner@hotel.com').toLowerCase();
      const users = JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');

      // Check if existing user
      let targetUser = users.find(
        (u) =>
          u.linkedGoogleEmail?.toLowerCase() === googleEmail ||
          u.email.toLowerCase() === googleEmail
      );

      if (!targetUser) {
        targetUser = {
          id: `google_${Date.now()}`,
          email: googleEmail,
          password: 'google_oauth_pass',
          fullName: customName || googleEmail.split('@')[0],
          role: requestedRole, // Default to admin/owner
          isGoogleLinked: true,
          linkedGoogleEmail: googleEmail,
        };
        users.push(targetUser);
        localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
      } else {
        // Upgrade to admin if requestedRole is admin
        if (requestedRole === 'admin' && targetUser.role === 'customer') {
          targetUser.role = 'admin';
          localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
        }
      }

      const sessionObj = {
        id: targetUser.id,
        email: targetUser.email,
        fullName: targetUser.fullName || customName,
        role: targetUser.role || requestedRole,
        isGoogleLinked: true,
        linkedGoogleEmail: googleEmail,
      };

      localStorage.setItem(LOCAL_KEYS.CURRENT_SESSION, JSON.stringify(sessionObj));
      setCurrentUser(sessionObj);
      return { success: true, user: sessionObj };
    }
  };

  /**
   * Switch role on the fly (Demo utility so user can easily toggle between Customer & Owner)
   */
  const switchRole = (newRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    localStorage.setItem(LOCAL_KEYS.CURRENT_SESSION, JSON.stringify(updated));
    setCurrentUser(updated);

    // Also update in users array
    const users = JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx].role = newRole;
      localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
    }
  };

  /**
   * Link Google Account to Current User
   */
  const linkGoogleAccount = async (googleEmail) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };
    const cleanGoogle = googleEmail.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').update({ is_google_linked: true }).eq('id', currentUser.id);
    } else {
      const users = JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
      const idx = users.findIndex((u) => u.id === currentUser.id);
      if (idx !== -1) {
        users[idx].isGoogleLinked = true;
        users[idx].linkedGoogleEmail = cleanGoogle;
        localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
      }
    }

    const updated = {
      ...currentUser,
      isGoogleLinked: true,
      linkedGoogleEmail: cleanGoogle,
    };
    localStorage.setItem(LOCAL_KEYS.CURRENT_SESSION, JSON.stringify(updated));
    setCurrentUser(updated);
    return { success: true, message: `Aapka Google Account (${cleanGoogle}) safaltapoorvak link ho gaya hai!` };
  };

  /**
   * Change Password
   */
  const changePassword = async (newPassword) => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { success: false, message: error.message };
    } else {
      const users = JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
      const idx = users.findIndex((u) => u.id === currentUser.id);
      if (idx !== -1) {
        users[idx].password = newPassword;
        localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
      }
    }
    return { success: true, message: 'Password safaltapoorvak badal diya gaya hai!' };
  };

  /**
   * SuperAdmin: Create Admin
   */
  const createAdminAccount = async (email, temporaryPassword, fullName) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.functions.invoke('create-admin', {
        body: { email: cleanEmail, temporaryPassword, fullName },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, user: data?.user };
    }

    if (checkLocalEmailExists(cleanEmail)) {
      return { success: false, message: 'Ye email pehle se exist karti hai!' };
    }
    return signup(cleanEmail, temporaryPassword, fullName, 'admin');
  };

  /**
   * Logout
   */
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_KEYS.CURRENT_SESSION);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        signup,
        loginWithGoogle,
        switchRole,
        linkGoogleAccount,
        changePassword,
        createAdminAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
