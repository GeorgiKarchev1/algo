import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { LemonSqueezyService } from '@/lib/lemonsqueezy/service';
import type { PlanType } from '@/lib/supabase/types';

export async function POST(request: NextRequest) {
  try {
    const { planType, redirectUrl } = await request.json();

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

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Create checkout session
    const lemonSqueezyService = new LemonSqueezyService();
    const result = await lemonSqueezyService.createCheckoutSession(
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