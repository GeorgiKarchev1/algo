/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PaddleService } from '@/lib/paddle/service';
import { paddleConfig } from '@/lib/paddle/config';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('paddle-signature');

    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Verify webhook signature
    if (!verifyPaddleSignature(body, signature, paddleConfig.webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;
    const eventData = event.data;

    console.log('Paddle webhook received:', eventType, eventData?.id);

    const paddleService = new PaddleService();

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.cancelled':
      case 'subscription.resumed':
      case 'subscription.paused':
      case 'subscription.trialing':
        await handleSubscriptionEvent(eventData, paddleService);
        break;

      case 'transaction.completed':
      case 'transaction.payment_failed':
        await handleTransactionEvent(eventData, paddleService);
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

function verifyPaddleSignature(body: string, signature: string, secret: string): boolean {
  try {
    // Paddle signature format: "ts=timestamp;h1=signature"
    const [tsPart, h1Part] = signature.split(';');
    const timestamp = tsPart.split('=')[1];
    const receivedSignature = h1Part.split('=')[1];

    // Create the signed payload
    const signedPayload = `${timestamp}:${body}`;
    
    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

async function handleSubscriptionEvent(
  eventData: any,
  paddleService: PaddleService
) {
  try {
    const subscriptionId = eventData.id;
    const customerId = eventData.customer_id;
    const status = eventData.status;
    const items = eventData.items || [];
    
    // Get price ID from the first item
    const priceId = items[0]?.price?.id;
    
    if (!priceId) {
      console.error('No price ID found in subscription event');
      return;
    }

    // Extract user ID from custom data or metadata
    const userId = eventData.custom_data?.user_id || eventData.metadata?.user_id;

    if (!userId) {
      console.error('No user ID found in subscription event');
      return;
    }

    await paddleService.handleSubscriptionEvent(
      subscriptionId,
      customerId,
      priceId,
      status,
      userId,
      eventData
    );

    console.log('Subscription event processed:', subscriptionId, status);
  } catch (error) {
    console.error('Error handling subscription event:', error);
  }
}

async function handleTransactionEvent(
  eventData: any,
  paddleService: PaddleService
) {
  try {
    const transactionId = eventData.id;
    const status = eventData.status;
    const amount = eventData.details?.totals?.total;
    const currency = eventData.currency_code;
    
    // Extract user ID from custom data or metadata
    const userId = eventData.custom_data?.user_id || eventData.metadata?.user_id;
    
    if (!userId) {
      console.error('No user ID found in transaction event');
      return;
    }

    // Get subscription ID if this is a subscription payment
    const subscriptionId = eventData.subscription_id;

    await paddleService.createPaymentTransaction(
      userId,
      transactionId,
      amount,
      currency,
      status,
      subscriptionId
    );

    console.log('Transaction event processed:', transactionId, status);
  } catch (error) {
    console.error('Error handling transaction event:', error);
  }
} 