import { createClient } from '@/lib/supabase/server';
import { SUBSCRIPTION_PLANS, paddleConfig, getPaddleHeaders, validatePaddleConfig } from './config';
import type { SubscriptionPlan, UserSubscription, PlanType } from '@/lib/supabase/types';
import { logger } from '../logger';

export class PaddleService {
  constructor() {
    // Validate configuration on service instantiation
    try {
      validatePaddleConfig();
    } catch (error) {
      logger.error('Paddle configuration validation failed:', error);
      throw error;
    }
  }

  private async getSupabase() {
    return await createClient();
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
      if (!plan) {
        return {
          checkoutUrl: '',
          error: `Invalid plan type: ${planType}`,
        };
      }



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

      // Create checkout session with Paddle (Paddle Billing API v1)
      const checkoutData = {
        items: [
          {
            price_id: plan.priceId,
            quantity: 1,
          },
        ],
        customer_email: userEmail,
        return_url: `https://algochad.com/success`,
        custom_data: {
          user_id: userId,
          plan: planType,
          user_email: userEmail,
          user_name: userName || '',
        },
        // Add checkout settings for better UX
        checkout_settings: {
          allow_logout: false,
          display_mode: "overlay",
          theme: "dark",
          locale: "en",
        },
      };



      // Use proper checkout sessions endpoint instead of transactions
      const response = await fetch(`${paddleConfig.baseUrl}/checkout-sessions`, {
        method: 'POST',
        headers: getPaddleHeaders(),
        body: JSON.stringify(checkoutData),
      });



      if (!response.ok) {
        const errorData = await response.json();
        logger.paddle.error('Paddle transaction error:', JSON.stringify(errorData, null, 2));
        
        // Provide more specific error messages
        let errorMessage = 'Failed to create transaction';
        
        if (errorData.error?.code === 'forbidden') {
          if (paddleConfig.environment === 'production') {
            errorMessage = 'Production API key issue. Please check: 1) Test Mode is enabled in Paddle dashboard, 2) API key has transaction permissions, 3) Account is verified';
          } else {
            errorMessage = 'API key or permissions issue. Please check your Paddle configuration.';
          }
        } else if (errorData.error?.code === 'not_found') {
          errorMessage = 'Price ID not found. Please check your Paddle product configuration.';
        } else if (errorData.error?.code === 'invalid_request') {
          errorMessage = `Invalid request data: ${errorData.error?.detail || 'Unknown validation error'}`;
        } else if (errorData.error?.detail) {
          errorMessage = errorData.error.detail;
        }
        
        return {
          checkoutUrl: '',
          error: `${errorMessage} (${response.status})`,
        };
      }

      const result = await response.json();

      
      // Check if checkout URL is available from checkout session
      if (result.data?.url) {
        return {
          checkoutUrl: result.data.url,
        };
      } else if (result.data?.checkout?.url) {
        return {
          checkoutUrl: result.data.checkout.url,
        };
      } else {
        logger.paddle.error('No checkout URL in checkout session response:', result);
        return {
          checkoutUrl: '',
          error: 'No checkout URL available in checkout session response',
        };
      }
    } catch (error) {
      logger.paddle.error('Checkout creation error:', error);
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
    try {
      const supabase = await this.getSupabase();
      
      const { data: plans, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) {
        logger.error('Error fetching subscription plans:', error);
        return [];
      }

      return plans || [];
    } catch (error) {
      logger.error('Error fetching subscription plans:', error);
      return [];
    }
  }

  /**
   * Gets user's active subscription
   */
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const supabase = await this.getSupabase();
      
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching user subscription:', error);
        return null;
      }

      return subscription as UserSubscription;
    } catch (error) {
      logger.error('Error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * Creates or updates subscription in database from Paddle webhook
   */
  async handleSubscriptionEvent(
    subscriptionId: string,
    customerId: string,
    priceId: string,
    status: string,
    userId: string,
    subscriptionData: Record<string, unknown>
  ): Promise<void> {
    try {
      const supabase = await this.getSupabase();
      
      // Find the plan by price ID
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('paddle_price_id', priceId)
        .single();

      if (!plan) {
        logger.error('Plan not found for price ID:', priceId);
        return;
      }

      const subscriptionRecord = {
        user_id: userId,
        plan_id: plan.id,
        paddle_subscription_id: subscriptionId,
        paddle_customer_id: customerId,
        status: this.mapPaddleStatusToInternal(status),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current_period_start: (subscriptionData.current_billing_period as any)?.starts_at
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? new Date((subscriptionData.current_billing_period as any).starts_at as string).toISOString()
          : null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current_period_end: (subscriptionData.current_billing_period as any)?.ends_at
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? new Date((subscriptionData.current_billing_period as any).ends_at as string).toISOString()
          : null,
        cancel_at_period_end: Boolean(subscriptionData.cancel_at_period_end),
        cancelled_at: subscriptionData.cancelled_at
          ? new Date(subscriptionData.cancelled_at as string).toISOString()
          : null,
        trial_end: subscriptionData.trial_end
          ? new Date(subscriptionData.trial_end as string).toISOString()
          : null,
      };

      // Upsert subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert(subscriptionRecord, {
          onConflict: 'paddle_subscription_id',
        });

      if (error) {
        logger.error('Error upserting subscription:', error);
      }
    } catch (error) {
      logger.error('Error handling subscription event:', error);
    }
  }

  /**
   * Creates payment transaction record
   */
  async createPaymentTransaction(
    userId: string,
    transactionId: string,
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
          paddle_transaction_id: transactionId,
          amount,
          currency,
          status: this.mapPaddlePaymentStatusToInternal(status),
        });

      if (error) {
        logger.error('Error creating payment transaction:', error);
      }
    } catch (error) {
      logger.error('Error creating payment transaction:', error);
    }
  }

  /**
   * Maps Paddle subscription status to internal status
   */
  private mapPaddleStatusToInternal(paddleStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'active',
      'paused': 'paused',
      'cancelled': 'cancelled',
      'expired': 'expired',
      'past_due': 'past_due',
      'trialing': 'active', // Consider trial as active
    };

    return statusMap[paddleStatus] || 'cancelled';
  }

  /**
   * Maps Paddle payment status to internal status
   */
  private mapPaddlePaymentStatusToInternal(paddleStatus: string): string {
    const statusMap: { [key: string]: string } = {
      'completed': 'completed',
      'pending': 'pending',
      'failed': 'failed',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
    };

    return statusMap[paddleStatus] || 'pending';
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${paddleConfig.baseUrl}/subscriptions/${subscriptionId}/cancel`,
        {
          method: 'POST',
          headers: getPaddleHeaders(),
          body: JSON.stringify({
            effective_from: 'end_of_billing_period',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error?.message || 'Failed to cancel subscription',
        };
      }

      return { success: true };
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Resume subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `${paddleConfig.baseUrl}/subscriptions/${subscriptionId}/resume`,
        {
          method: 'POST',
          headers: getPaddleHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error?.message || 'Failed to resume subscription',
        };
      }

      return { success: true };
    } catch (error) {
      logger.error('Error resuming subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
} 