import { supabase } from '@/lib/supabase/client';
import type { 
  AuthUser, 
  AuthResponse, 
  SignUpFormData, 
  UserProfile 
} from '@/lib/supabase/types';
import type { User } from '@supabase/supabase-js';

/**
 * Authentication Service Class
 * Handles all authentication-related operations with Supabase
 */
export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  /**
   * Get singleton instance of AuthService
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Sign in user with email and password
   */
  public async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return {
          success: false,
          message: this.getErrorMessage(error.message),
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: 'Authentication failed',
          error: 'No user data returned',
        };
      }

      const user = await this.transformUser(data.user);
      
      return {
        success: true,
        message: 'Successfully signed in!',
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Sign up new user
   */
  public async signUp(formData: SignUpFormData): Promise<AuthResponse> {
    try {
      const { email, password, fullName, username } = formData;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            username: username?.trim(),
          },
        },
      });

      if (error) {
        return {
          success: false,
          message: this.getErrorMessage(error.message),
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          message: 'Registration failed',
          error: 'No user data returned',
        };
      }

      // Create user profile
      await this.createUserProfile(data.user, fullName, username);

      // Only return user if email is confirmed
      if (data.user.email_confirmed_at) {
        const user = await this.transformUser(data.user);
        return {
          success: true,
          message: 'Account created successfully!',
          user,
        };
      } else {
        return {
          success: true,
          message: 'Please check your email to verify your account.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Sign out current user
   */
  public async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Reset user password
   */
  public async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        return {
          success: false,
          message: this.getErrorMessage(error.message),
          error: error.message,
        };
      }

      return {
        success: true,
        message: 'Password reset email sent! Check your inbox.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send reset email',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get current user
   */
  public async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      const transformedUser = await this.transformUser(user);
      return transformedUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  public async updateProfile(data: Partial<UserProfile>): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return {
          success: false,
          message: 'User not authenticated',
          error: 'No authenticated user',
        };
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        return {
          success: false,
          message: 'Failed to update profile',
          error: updateError.message,
        };
      }

      return {
        success: true,
        message: 'Profile updated successfully!',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create user profile in profiles table
   */
  private async createUserProfile(
    user: User, 
    fullName: string, 
    username?: string
  ): Promise<void> {
    try {
      // Note: Database triggers should automatically create the profile,
      // but we'll attempt manual creation as a fallback
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          username: username || null,
          avatar_url: null,
        });

      if (error) {
        // Check for specific error types
        if (error.code === '23505') {
          // Profile already exists (created by trigger) - this is expected and good
          return;
        }
        
        if (error.code === '42P01') {
          // Table doesn't exist - this shouldn't happen after setup
          throw new Error('Database setup incomplete: profiles table missing');
        }
        
        // Other unexpected errors
        throw new Error(`Profile creation failed: ${error.message}`);
      }
    } catch (error) {
      // Silently handle expected duplicate errors (from database triggers)
      if (error instanceof Error && error.message.includes('duplicate key value')) {
        return; // Profile was created by trigger, which is expected
      }
      
      // Re-throw unexpected errors
      throw error;
    }
  }

  /**
   * Transform Supabase User to AuthUser
   */
  private async transformUser(user: User): Promise<AuthUser> {
    // Try to get profile data
    let profile: UserProfile | null = null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        profile = data as UserProfile;
      }
    } catch {
      // Profile might not exist yet, that's okay
    }


    return {
      id: user.id,
      email: user.email!,
      fullName: profile?.full_name || user.user_metadata?.full_name || null,
      avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
      username: profile?.username || user.user_metadata?.username || null,
    };
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password. Please try again.',
      'Email not confirmed': 'Please verify your email before signing in.',
      'User already registered': 'An account with this email already exists.',
      'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
      'Unable to validate email address: invalid format': 'Please enter a valid email address.',
      'signup_disabled': 'New registrations are currently disabled.',
    };

    return errorMap[error] || error;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance(); 