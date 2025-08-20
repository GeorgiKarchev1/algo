'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import { logger } from '@/lib/logger';

type PlanType = 'CASUAL' | 'GIGACHAD';

interface Plan {
  id: PlanType;
  name: string;
  price: number;
  features: string[];
  description: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'CASUAL',
    name: 'Casual Learner',
    price: 9,
    description: 'Perfect for beginners starting their coding journey',
    features: [
      'Access to all easy problems',
      'Step-by-step solutions',
      'Community support',
      'Progress tracking',
      'Mobile-friendly interface'
    ]
  },
  {
    id: 'GIGACHAD',
    name: 'GigaChad Developer',
    price: 19,
    description: 'For serious developers who want to master algorithms',
    popular: true,
    features: [
      'Everything in Casual plan',
      'Access to medium & hard problems',
      'Advanced solution explanations',
      'Performance optimization tips',
      'Interview preparation guides',
      'Priority support',
      'Exclusive content'
    ]
  }
];

export default function PricingPage() {
  const [loading, setLoading] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (planType: PlanType) => {
    setLoading(planType);
    setError(null);

    try {
      // Map plan types to price IDs
      const priceIdMap: { [key in PlanType]: string } = {
        'CASUAL': process.env.NEXT_PUBLIC_PADDLE_CASUAL_PRICE_ID || '',
        'GIGACHAD': process.env.NEXT_PUBLIC_PADDLE_GIGACHAD_PRICE_ID || '',
      };

      const priceId = priceIdMap[planType];
      if (!priceId) {
        throw new Error(`Price ID not found for plan: ${planType}`);
      }



      // Use Paddle.js for checkout
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && (window as any).Paddle) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paddle = (window as any).Paddle;
        // Initialize Paddle if not already done
        if (paddle.Environment) {
          paddle.Environment.set('production');
        }
        paddle.Initialize({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            eventCallback: (data: any) => {
              if (data.event === 'Checkout.Complete') {
                window.location.href = `/success?_ptxn=${data.checkout.id}`;
              }
            }
          });

        // Open checkout
        paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customer: {
            email: 'test@example.com' // We can get this from auth later
          },
          settings: {
            allowLogout: false,
            displayMode: 'overlay',
            theme: 'dark',
            locale: 'en'
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          successCallback: (data: any) => {
            window.location.href = `/success?_ptxn=${data.checkout.id}`;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          closeCallback: (data: any) => {
            setLoading(null);
          }
        });
      } else {
        throw new Error('Paddle.js is not loaded');
      }
    } catch (err) {
      logger.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Choose Your Path to Mastery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start your algorithm journey today. Choose the plan that fits your learning style and goals.
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-8 ${
                plan.popular
                  ? 'border-2 border-blue-500 bg-blue-500/5'
                  : 'border border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Start Being ${plan.id === 'CASUAL' ? 'Less Confused' : 'Absolutely Based'}`
                  )}
                </Button>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">What&apos;s included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
          <p className="text-sm text-gray-500">
            Need help choosing? <a href="mailto:support@algochad.com" className="text-blue-400 hover:text-blue-300">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
