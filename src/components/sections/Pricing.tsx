'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Zap, Crown, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import type { PlanType } from '@/lib/supabase/types';

const pricingPlans = [
  {
    id: 'casual',
    name: 'Casual Learner',
    emoji: '🗿',
    price: '$9',
    period: '/month',
    description: 'For the stone-cold beginner who wants to start somewhere',
    features: [
      '10 lessons/month',
      'Basic visualizations',
      'Community access',
      'Mobile app',
      'Email support'
    ],
    buttonText: 'Start Being Less Confused',
    popular: false,
    gradient: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20'
  },
  {
    id: 'gigachad',
    name: 'GigaChad Developer',
    emoji: '🗿💎',
    price: '$19',
    period: '/month',
    description: 'Chad energy meets lazy efficiency - the perfect combo fr fr',
    features: [
      'Unlimited lessons',
      'Advanced visualizations',
      'Priority support',
      'Interview prep mode',
      'Progress analytics',
      'Custom learning paths',
      'Discord VIP access'
    ],
    buttonText: 'Become Absolutely Based',
    popular: true,
    gradient: 'from-blue-500 to-purple-600',
    bgColor: 'bg-gradient-to-br from-blue-500/10 to-purple-600/10',
    borderColor: 'border-blue-500/30'
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      // Show auth modal for sign up/login
      setShowAuthModal(true);
      return;
    }

    setLoadingPlan(planId);

    try {
      const planTypeMap: { [key: string]: PlanType } = {
        'casual': 'CASUAL',
        'gigachad': 'GIGACHAD',
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: planTypeMap[planId],
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Paddle checkout
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/20 via-transparent to-neutral-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-400">Choose Your Path</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stone Cold Pricing 🗿
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No cap, these prices are bussin&apos;. Pick your vibe and start your algorithmic glow-up journey.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 } 
              }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  whileInView={{ scale: 1, rotate: -12 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.2 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    <div className="flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      Most Based
                    </div>
                  </div>
                </motion.div>
              )}

              <Card className={`relative overflow-hidden h-full border-2 ${plan.borderColor} ${plan.bgColor} backdrop-blur-sm transition-all duration-300 hover:border-opacity-50 hover:shadow-2xl hover:shadow-blue-500/10`}>
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="text-6xl mb-4"
                      animate={{ 
                        rotate: [0, 2, -2, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    >
                      {plan.emoji}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="flex items-baseline justify-center mb-2">
                      <span className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-grow mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: 0.8 + index * 0.2 + featureIndex * 0.1 
                          }}
                          className="flex items-center gap-3"
                        >
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loadingPlan === plan.id}
                      className={`w-full group relative overflow-hidden ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                          : `bg-gradient-to-r ${plan.gradient} hover:opacity-90`
                      } border-0 text-white font-semibold disabled:opacity-50`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <span className="relative flex items-center justify-center gap-2">
                        {loadingPlan === plan.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            {plan.buttonText}
                            <Zap className="w-4 h-4 transition-transform group-hover:scale-110" />
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </CardContent>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-current" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">7-day</div>
              <div className="text-sm text-muted-foreground">Free trial</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">No contract</div>
              <div className="text-sm text-muted-foreground">Cancel anytime</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">30-day</div>
              <div className="text-sm text-muted-foreground">Money back</div>
            </div>
          </div>
          
          <motion.p 
            className="text-muted-foreground mt-6 text-lg"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Join the <span className="text-primary-400 font-semibold">5,000+</span> developers who chose the lazy path to success 🚀
          </motion.p>
        </motion.div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            // User is now authenticated, they can try subscribing again
          }}
        />
      )}
    </section>
  );
} 