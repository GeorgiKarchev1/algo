import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LemonSqueezyService } from '@/lib/lemonsqueezy/service';
import { lemonSqueezyConfig } from '@/lib/lemonsqueezy/config';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');

    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', lemonSqueezyConfig.webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.meta.event_name;
    const eventData = event.data;

    console.log('LemonSqueezy webhook received:', eventType, eventData?.id);

    const lemonSqueezyService = new LemonSqueezyService();

    switch (eventType) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_cancelled':
      case 'subscription_resumed':
      case 'subscription_expired':
      case 'subscription_paused':
      case 'subscription_unpaused':
        await handleSubscriptionEvent(eventData, lemonSqueezyService);
        break;

      case 'order_created':
        await handleOrderEvent(eventData, lemonSqueezyService);
        break;

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionEvent(
  eventData: any,
  lemonSqueezyService: LemonSqueezyService
) {
  try {
    const subscriptionId = eventData.id;
    const attributes = eventData.attributes;
    const customerId = attributes.customer_id;
    const variantId = attributes.variant_id;
    const status = attributes.status;
    const userId = attributes.user_id || eventData.meta?.custom_data?.user_id;

    if (!userId) {
      console.error('No user ID found in subscription event');
      return;
    }

    await lemonSqueezyService.handleSubscriptionEvent(
      subscriptionId,
      customerId,
      variantId,
      status,
      userId,
      attributes
    );

    console.log('Subscription event processed:', subscriptionId, status);
  } catch (error) {
    console.error('Error handling subscription event:', error);
  }
}

async function handleOrderEvent(
  eventData: any,
  lemonSqueezyService: LemonSqueezyService
) {
  try {
    const orderId = eventData.id;
    const attributes = eventData.attributes;
    const userId = attributes.user_id || eventData.meta?.custom_data?.user_id;

    if (!userId) {
      console.error('No user ID found in order event');
      return;
    }

    const amount = attributes.total;
    const currency = attributes.currency;
    const status = attributes.status;

    await lemonSqueezyService.createPaymentTransaction(
      userId,
      orderId,
      amount,
      currency,
      status
    );

    console.log('Order event processed:', orderId, status);
  } catch (error) {
    console.error('Error handling order event:', error);
  }
} 