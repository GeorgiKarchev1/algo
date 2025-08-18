import { NextRequest, NextResponse } from 'next/server';
import { PaddleService } from '@/lib/paddle/service';
import type { PlanType } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Checkout API called');
    console.log('📊 Request URL:', request.url);
    console.log('📊 Request method:', request.method);
    console.log('📊 Request headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('📊 Request body:', body);
    const { planType } = body;

    if (!planType) {
      console.log('❌ Plan type is missing');
      return NextResponse.json(
        { error: 'Plan type is required' },
        { status: 400 }
      );
    }

    // Validate plan type
    const validPlans: PlanType[] = ['CASUAL', 'GIGACHAD'];
    if (!validPlans.includes(planType)) {
      console.log('❌ Invalid plan type:', planType);
      return NextResponse.json(
        { error: `Invalid plan type. Must be one of: ${validPlans.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('✅ Plan type validation passed:', planType);

    // Temporary: Skip authentication for testing
    console.log('🧪 Testing checkout without authentication');
    
    // Mock user data for testing
    const user = { 
      id: 'test-user-123', 
      email: 'test@example.com' 
    };
    const profile = { 
      full_name: 'Test User', 
      email: 'test@example.com' 
    };

    console.log('👤 Using mock user data:', user);

    // Create checkout session
    let paddleService: PaddleService;
    try {
      console.log('🔧 Initializing PaddleService...');
      paddleService = new PaddleService();
      console.log('✅ PaddleService initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize PaddleService:', error);
      return NextResponse.json(
        { error: 'Payment service configuration error' },
        { status: 500 }
      );
    }

    console.log('🛒 Creating checkout session...');
    const result = await paddleService.createCheckoutSession(
      user.id,
      planType,
      user.email || profile.email,
      profile.full_name || undefined
    );

    console.log('📊 Checkout session result:', result);

    if (result.error) {
      console.error('❌ Checkout session creation failed:', result.error);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log('✅ Checkout session created successfully:', result.checkoutUrl);
    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
      success: true,
    });

  } catch (error) {
    console.error('❌ Checkout API error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 