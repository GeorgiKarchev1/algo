import { supabase } from '@/lib/supabase/client';
import type { UserSubscription, PlanType } from '@/lib/supabase/types';

export class LemonSqueezyClientService {
  /**
   * Creates a checkout session via API route
   */
  async createCheckoutSession(
    planType: PlanType,
    userEmail: string,
    userName?: string
  ): Promise<{ checkoutUrl: string; error?: string }> {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          userEmail,
          userName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Checkout creation error:', error);
      return {
        checkoutUrl: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Gets user's active subscription using client-side Supabase
   */
  async getUserActiveSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            description,
            price_monthly,
            features
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('current_period_end', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * Refreshes user's subscription data
   */
  async refreshUserSubscription(userId: string): Promise<UserSubscription | null> {
    // This is the same as getUserActiveSubscription, but we call it refresh 
    // to be explicit about the intent
    return this.getUserActiveSubscription(userId);
  }

  /**
   * Checks if user has an active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getUserActiveSubscription(userId);
    return subscription !== null;
  }

  /**
   * Gets subscription plans from database using client-side Supabase
   */
  async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) {
        console.error('Error fetching subscription plans:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }
  }
}

// Export singleton instance
export const lemonSqueezyClientService = new LemonSqueezyClientService(); 