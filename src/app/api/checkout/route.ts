import { NextRequest, NextResponse } from 'next/server';
import { PaddleService } from '@/lib/paddle/service';
import { logger } from '@/lib/logger';
import type { PlanType } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    logger.debug('🚀 Checkout API called');
    logger.debug('📊 Request URL:', request.url);
    logger.debug('📊 Request method:', request.method);
    logger.debug('📊 Request headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    logger.debug('📊 Request body:', body);
    const { planType } = body;

    if (!planType) {
      logger.debug('❌ Plan type is missing');
      return NextResponse.json(
        { error: 'Plan type is required' },
        { status: 400 }
      );
    }

    // Validate plan type
    const validPlans: PlanType[] = ['CASUAL', 'GIGACHAD'];
    if (!validPlans.includes(planType)) {
      logger.debug('❌ Invalid plan type:', planType);
      return NextResponse.json(
        { error: `Invalid plan type. Must be one of: ${validPlans.join(', ')}` },
        { status: 400 }
      );
    }

    logger.debug('✅ Plan type validation passed:', planType);

    // Temporary: Skip authentication for testing
    logger.debug('🧪 Testing checkout without authentication');
    
    // Mock user data for testing
    const user = { 
      id: 'test-user-123', 
      email: 'test@example.com' 
    };
    const profile = { 
      full_name: 'Test User', 
      email: 'test@example.com' 
    };

    logger.debug('👤 Using mock user data:', user);

    // Create checkout session
    let paddleService: PaddleService;
    try {
      logger.debug('🔧 Initializing PaddleService...');
      paddleService = new PaddleService();
      logger.debug('✅ PaddleService initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize PaddleService:', error);
      return NextResponse.json(
        { error: 'Payment service configuration error' },
        { status: 500 }
      );
    }

    logger.debug('🛒 Creating checkout session...');
    const result = await paddleService.createCheckoutSession(
      user.id,
      planType,
      user.email || profile.email,
      profile.full_name || undefined
    );

    logger.debug('📊 Checkout session result:', result);

    if (result.error) {
      logger.error('❌ Checkout session creation failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    logger.debug('✅ Checkout session created successfully:', result.checkoutUrl);
    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
      success: true,
    });

  } catch (error) {
    logger.error('❌ Checkout API error:', error);
    logger.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 