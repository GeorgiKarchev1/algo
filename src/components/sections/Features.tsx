'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Clock, Eye, TrendingUp, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Daily 1-Minute Challenges',
    description: 'Bite-sized lessons that fit into your busy life. No marathon study sessions, just consistent tiny steps.',
    details: 'Each challenge is carefully crafted to teach one concept without overwhelming you. Perfect for busy developers.',
    gradient: 'from-primary-500 to-primary-600'
  },
  {
    icon: Eye,
    title: 'Visual Explanations with Code & Animations',
    description: 'Watch algorithms come to life with interactive visualizations. See exactly how your code behaves.',
    details: 'Complex concepts simplified through beautiful animations, step-by-step breakdowns, and real code examples.',
    gradient: 'from-secondary-500 to-secondary-600'
  },
  {
    icon: TrendingUp,
    title: 'Effortless Progress Tracking',
    description: 'Your progress happens naturally. No streaks to maintain, no pressure. Just gentle forward momentum.',
    details: 'Smart tracking that celebrates small wins and keeps you motivated without creating anxiety.',
    gradient: 'from-accent-500 to-accent-600'
  }
];

export default function Features() {
  return (
    <section className="py-24 px-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Learning that fits your{' '}
            <span className="gradient-text">lazy lifestyle</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We&apos;ve designed every aspect around minimal effort and maximum understanding.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full group">
                <CardHeader>
                  {/* Icon with gradient background */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  
                  <CardTitle className="text-xl mb-2">
                    {feature.title}
                  </CardTitle>
                  
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground/80 mb-4">
                    {feature.details}
                  </p>
                  
                  {/* Learn More Link */}
                  <div className="flex items-center text-sm font-medium text-primary-400 group-hover:text-primary-300 transition-colors cursor-pointer">
                    <span>Learn more</span>
                    <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-muted-foreground">
              <span className="text-green-400 font-medium">12,847</span> concepts mastered this week
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 