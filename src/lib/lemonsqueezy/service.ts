import {
  createCheckout,
  getCustomer,
  getSubscription,
  listCustomers,
} from '@lemonsqueezy/lemonsqueezy.js';
import { createClient } from '@/lib/supabase/server';
import { SUBSCRIPTION_PLANS, lemonSqueezyConfig } from './config';
import type { SubscriptionPlan, UserSubscription, PlanType } from '@/lib/supabase/types';

export class LemonSqueezyService {
  private supabase: any = null;

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient();
    }
    return this.supabase;
  }

  /**
   * Creates a checkout session for a subscription plan
   */
  async createCheckoutSession(
    userId: string,
    planType: PlanType,
    userEmail: string,
    userName?: string
  ): Promise<{ checkoutUrl: string; error?: string }> {
    try {
      const plan = SUBSCRIPTION_PLANS[planType];
      const supabase = await this.getSupabase();
      
      // Check if user already has an active subscription
      const { data: existingSubscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (existingSubscription) {
        return {
          checkoutUrl: '',
          error: 'User already has an active subscription',
        };
      }

      // Simplified checkout creation
      const checkoutUrl = `https://lazyalgoclub.lemonsqueezy.com/checkout/buy/${plan.variantId}?checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`;

      return {
        checkoutUrl,
      };
    } catch (error) {
      console.error('Checkout creation error:', error);
      return {
        checkoutUrl: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Gets subscription plans from database
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const supabase = await this.getSupabase();
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
  }

  /**
   * Gets user's active subscription
   */
  async getUserActiveSubscription(userId: string): Promise<UserSubscription | null> {
    const supabase = await this.getSupabase();
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
  }

  /**
   * Creates or updates subscription in database from LemonSqueezy webhook
   */
  async handleSubscriptionEvent(
    subscriptionId: string,
    customerId: string,
    variantId: string,
    status: string,
    userId: string,
    subscriptionData: any
  ): Promise<void> {
    try {
      const supabase = await this.getSupabase();
      
      // Find the plan by variant ID
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('lemon_variant_id', variantId)
        .single();

      if (!plan) {
        console.error('Plan not found for variant:', variantId);
        return;
      }

      const subscriptionRecord = {
        user_id: userId,
        plan_id: plan.id,
        lemon_subscription_id: subscriptionId,
        lemon_customer_id: customerId,
        status: this.mapLemonSqueezyStatusToInternal(status),
        current_period_start: subscriptionData.current_period_start
          ? new Date(subscriptionData.current_period_start).toISOString()
          : null,
        current_period_end: subscriptionData.current_period_end
          ? new Date(subscriptionData.current_period_end).toISOString()
          : null,
        cancel_at_period_end: subscriptionData.cancel_at_period_end || false,
        cancelled_at: subscriptionData.cancelled_at
          ? new Date(subscriptionData.cancelled_at).toISOString()
          : null,
        trial_end: subscriptionData.trial_end
          ? new Date(subscriptionData.trial_end).toISOString()
          : null,
      };

      // Upsert subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert(subscriptionRecord, {
          onConflict: 'lemon_subscription_id',
        });

      if (error) {
        console.error('Error upserting subscription:', error);
      }
    } catch (error) {
      console.error('Error handling subscription event:', error);
    }
  }

  /**
   * Creates payment transaction record
   */
  async createPaymentTransaction(
    userId: string,
    orderId: string,
    amount: number,
    currency: string,
    status: string,
    subscriptionId?: string
  ): Promise<void> {
    try {
      const supabase = await this.getSupabase();
      
      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: userId,
          subscription_id: subscriptionId || null,
          lemon_order_id: orderId,
          amount,
          currency,
          status: this.mapLemonSqueezyPaymentStatusToInternal(status),
        });

      if (error) {
        console.error('Error creating payment transaction:', error);
      }
    } catch (error) {
      console.error('Error creating payment transaction:', error);
    }
  }

  /**
   * Maps LemonSqueezy subscription status to internal status
   */
  private mapLemonSqueezyStatusToInternal(status: string): 'active' | 'paused' | 'cancelled' | 'expired' | 'past_due' {
    switch (status.toLowerCase()) {
      case 'active':
        return 'active';
      case 'paused':
        return 'paused';
      case 'cancelled':
        return 'cancelled';
      case 'expired':
        return 'expired';
      case 'past_due':
        return 'past_due';
      default:
        return 'cancelled';
    }
  }

  /**
   * Maps LemonSqueezy payment status to internal status
   */
  private mapLemonSqueezyPaymentStatusToInternal(status: string): 'pending' | 'paid' | 'failed' | 'refunded' {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'paid';
      case 'pending':
        return 'pending';
      case 'failed':
        return 'failed';
      case 'refunded':
        return 'refunded';
      default:
        return 'pending';
    }
  }

  /**
   * Cancels a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await this.getSupabase();
      
      // Update in our database
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          cancel_at_period_end: true,
          cancelled_at: new Date().toISOString(),
        })
        .eq('lemon_subscription_id', subscriptionId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
} 