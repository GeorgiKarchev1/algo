import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PaddleService } from '@/lib/paddle/service';
import type { PlanType } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Checkout API called');
    const body = await request.json();
    console.log('📊 Request body:', body);
    const { planType } = body;

    if (!planType) {
      return NextResponse.json(
        { error: 'Plan type is required' },
        { status: 400 }
      );
    }

    // Validate plan type
    const validPlans: PlanType[] = ['CASUAL', 'GIGACHAD', ];
    if (!validPlans.includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

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

    // Create checkout session
    const paddleService = new PaddleService();
    const result = await paddleService.createCheckoutSession(
      user.id,
      planType,
      user.email || profile.email,
      profile.full_name || undefined
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
      success: true,
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 