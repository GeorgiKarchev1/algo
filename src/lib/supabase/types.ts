// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          problem_id: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_id: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_id?: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscription_plans: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price_monthly: number;
          lemon_product_id: string;
          lemon_variant_id: string;
          features: string[] | null;
          is_popular: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price_monthly: number;
          lemon_product_id: string;
          lemon_variant_id: string;
          features?: string[] | null;
          is_popular?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price_monthly?: number;
          lemon_product_id?: string;
          lemon_variant_id?: string;
          features?: string[] | null;
          is_popular?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          lemon_subscription_id: string;
          lemon_customer_id: string;
          status: 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due';
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          cancelled_at: string | null;
          trial_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          lemon_subscription_id: string;
          lemon_customer_id: string;
          status?: 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          cancelled_at?: string | null;
          trial_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          lemon_subscription_id?: string;
          lemon_customer_id?: string;
          status?: 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          cancelled_at?: string | null;
          trial_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_transactions: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          lemon_order_id: string;
          amount: number;
          currency: string;
          status: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          lemon_order_id: string;
          amount: number;
          currency?: string;
          status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          lemon_order_id?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_method?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_active_subscription: {
        Args: {
          user_uuid: string;
        };
        Returns: Array<{
          subscription_id: string;
          plan_name: string;
          status: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
        }>;
      };
    };
    Enums: {
      subscription_status: 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due';
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    };
  };
}

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  username?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  created_at: string;
  updated_at: string;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  lemon_product_id: string;
  lemon_variant_id: string;
  features: string[] | null;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  lemon_subscription_id: string;
  lemon_customer_id: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  user_id: string;
  subscription_id: string | null;
  lemon_order_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

// Auth Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  fullName: string;
  username?: string;
}

export interface ResetPasswordFormData {
  email: string;
}

// Auth Response Types
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  error?: string;
}

// Auth State Types
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  subscription?: UserSubscription | null;
}

// Auth Context Types
export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (formData: SignUpFormData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updateProfile: (data: Partial<UserProfile>) => Promise<AuthResponse>;
  refreshSubscription: () => Promise<void>;
} 

// Plan Type
export type PlanType = 'CASUAL' | 'GIGACHAD';