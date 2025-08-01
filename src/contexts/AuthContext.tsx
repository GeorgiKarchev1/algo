'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { authService } from '@/lib/auth/AuthService';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { 
  AuthContextType, 
  AuthState, 
  AuthUser, 
  AuthResponse, 
  SignUpFormData,
  UserProfile,
  UserSubscription 
} from '@/lib/supabase/types';
// import { paddleClientService } from '@/lib/paddle/client-service';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth methods to child components
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
    subscription: null,
  });

  // Initialize authentication state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        let subscription: UserSubscription | null = null;
        
        // Get subscription if user exists
        if (user) {
          // subscription = await paddleClientService.getUserSubscription(user.id);
          subscription = null; // Temporarily disabled
        }
        
        if (mounted) {
          setState({
            user,
            loading: false,
            initialized: true,
            subscription,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setState({
            user: null,
            loading: false,
            initialized: true,
            subscription: null,
          });
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state change:', event, session?.user?.id);
        if (!mounted) return;

        // Optimize: Only fetch user data when necessary
        if (event === 'SIGNED_IN' && session?.user) {
          // Only get fresh user data if we don't have a user or if user ID changed
          if (!state.user || state.user.id !== session.user.id) {
            const user = await authService.getCurrentUser();
            let subscription: UserSubscription | null = null;
            
            // Get subscription if user exists
            if (user) {
              // subscription = await paddleClientService.getUserSubscription(user.id);
              subscription = null; // Temporarily disabled
            }
            
            setState(prev => ({
              ...prev,
              user,
              loading: false,
              subscription,
            }));
          } else {
            // Just update loading state if user exists
            setState(prev => ({
              ...prev,
              loading: false,
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          setState(prev => ({
            ...prev,
            user: null,
            loading: false,
            subscription: null,
          }));
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Don't fetch user data on token refresh - it's unnecessary
          // Just ensure loading is false
          setState(prev => ({
            ...prev,
            loading: false,
          }));
        } else if (event === 'USER_UPDATED' && session?.user) {
          console.log('User updated, refreshing user data...');
          // Refresh user data when user is updated (e.g., email confirmed)
          const user = await authService.getCurrentUser();
          let subscription: UserSubscription | null = null;
          
          if (user) {
            // subscription = await paddleClientService.getUserSubscription(user.id);
            subscription = null; // Temporarily disabled
          }
          
          console.log('Updated user data:', user);
          setState(prev => ({
            ...prev,
            user,
            loading: false,
            subscription,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [state.user?.id]); // Add user ID as dependency to re-run when user changes

  /**
   * Sign in user
   */
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await authService.signIn(email, password);
      
      if (response.success && response.user) {
        setState(prev => ({
          ...prev,
          user: response.user!,
          loading: false,
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
      
      return response;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  /**
   * Sign up new user
   */
  const signUp = async (formData: SignUpFormData): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await authService.signUp(formData);
      
      // Only set user in state if email is confirmed
      if (response.success && response.user) {
        setState(prev => ({
          ...prev,
          user: response.user!,
          loading: false,
        }));
      } else {
        // Just set loading to false, don't set user if email not confirmed
        setState(prev => ({ ...prev, loading: false }));
      }
      
      return response;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return {
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  /**
   * Sign out user
   */
  const signOut = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await authService.signOut();
      setState(prev => ({
        ...prev,
        user: null,
        loading: false,
      }));
    } catch (error) {
      console.error('Error signing out:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    return await authService.resetPassword(email);
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data: Partial<UserProfile>): Promise<AuthResponse> => {
    try {
      const response = await authService.updateProfile(data);
      
      if (response.success && state.user) {
        // Refresh user data
        const updatedUser = await authService.getCurrentUser();
        setState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async (): Promise<void> => {
    console.log('Refreshing user...');
    try {
      const user = await authService.getCurrentUser();
      console.log('Refreshed user:', user);
      let subscription: UserSubscription | null = null;
      
      if (user) {
        // subscription = await paddleClientService.getUserSubscription(user.id);
        subscription = null; // Temporarily disabled
      }
      
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        subscription,
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  /**
   * Refresh subscription data
   */
  const refreshSubscription = async (): Promise<void> => {
    if (!state.user) return;
    
    try {
      // const subscription = await paddleClientService.getUserSubscription(state.user.id);
      const subscription = null; // Temporarily disabled
      
      setState(prev => ({
        ...prev,
        subscription,
      }));
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    }
  };

  // Context value
  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshUser,
    refreshSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use authentication context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Custom hook to get current user
 */
export function useUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

/**
 * Custom hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user, initialized } = useAuth();
  return initialized && user !== null;
}

/**
 * Custom hook for authentication loading state
 */
export function useAuthLoading(): boolean {
  const { loading } = useAuth();
  return loading;
} 