'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    avatar: '👩‍💻',
    content: 'Finally, DSA that doesn\'t make me want to cry. The 1-minute lessons fit perfectly into my coffee breaks.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Full Stack Engineer',
    avatar: '👨‍🚀',
    content: 'I\'ve been "learning" algorithms for 3 years. Lazy Algo Club taught me more in 3 weeks than all those boring textbooks.',
    rating: 5
  },
  {
    name: 'Alex Kim',
    role: 'CS Student',
    avatar: '🧑‍🎓',
    content: 'My professor should take notes. This is how you make complex stuff actually stick in your brain.',
    rating: 5
  },
  {
    name: 'Jamie Taylor',
    role: 'Backend Developer',
    avatar: '👩‍🔬',
    content: 'No more imposter syndrome in tech interviews. I actually understand what I\'m talking about now!',
    rating: 5
  },
  {
    name: 'Dev Patel',
    role: 'Software Engineer',
    avatar: '👨‍💼',
    content: 'The visual explanations are *chef\'s kiss*. Finally clicked why everyone talks about Big O notation.',
    rating: 5
  },
  {
    name: 'Riley Johnson',
    role: 'Bootcamp Grad',
    avatar: '🧑‍🎨',
    content: 'Went from "algorithms are scary" to "bring on the coding challenges" in just a month. Game changer.',
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-950/10 via-transparent to-accent-950/10" />
      
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
            What lazy learners are saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real feedback from developers who went from algorithm anxiety to algorithm confidence.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-glow-purple/20 transition-all duration-300">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start mb-4">
                    <Quote className="w-8 h-8 text-primary-400 opacity-50" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average rating</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">2,847</div>
              <div className="text-sm text-muted-foreground">Happy learners</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">94%</div>
              <div className="text-sm text-muted-foreground">Would recommend</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 