import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary-950/20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary-400" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            The rules and guidelines for using Lazy Algo Club
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Acceptance */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Lazy Algo Club (&quot;the Service&quot;), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Service Description</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Lazy Algo Club is an online learning platform that provides algorithm and data structure 
                education through interactive lessons, coding challenges, and progress tracking.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Our services include:</p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                  <li>Interactive algorithm lessons and tutorials</li>
                  <li>Coding challenges and practice problems</li>
                  <li>Progress tracking and analytics</li>
                  <li>Community features and discussions</li>
                  <li>Premium content and advanced features</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">User Accounts</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Creation</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>You must be at least 13 years old to create an account</li>
                    <li>One account per person is allowed</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Responsibilities</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Keep your login credentials secure</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>You are responsible for all activities under your account</li>
                    <li>Do not share your account with others</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Acceptable Use Policy</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  You agree to use our service responsibly and in accordance with these guidelines:
                </p>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-green-400">You May:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Use the service for personal learning and education</li>
                    <li>Share your progress and achievements</li>
                    <li>Participate in community discussions respectfully</li>
                    <li>Provide feedback and suggestions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-red-400">You May Not:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Violate any laws or regulations</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Share inappropriate or offensive content</li>
                    <li>Attempt to hack or compromise the platform</li>
                    <li>Use automated tools to scrape or abuse the service</li>
                    <li>Resell or redistribute our content without permission</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment and Subscriptions */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Payment and Subscriptions</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Subscription Plans</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>We offer both free and premium subscription plans</li>
                    <li>Premium features require a paid subscription</li>
                    <li>Subscriptions are billed monthly or annually</li>
                    <li>Prices are subject to change with notice</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Payment Terms</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Payment is due at the start of each billing period</li>
                    <li>We accept major credit cards and PayPal</li>
                    <li>Failed payments may result in service suspension</li>
                    <li>You can cancel your subscription at any time</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Refund Policy</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>30-day money-back guarantee for new subscribers</li>
                    <li>Refunds are processed within 5-10 business days</li>
                    <li>Partial refunds may be available for unused time</li>
                    <li>Contact support for refund requests</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Intellectual Property</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Our Content</h3>
                  <p className="text-muted-foreground">
                    All content on Lazy Algo Club, including text, graphics, logos, videos, and software, 
                    is owned by us or our licensors and is protected by copyright and other intellectual 
                    property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Your Content</h3>
                  <p className="text-muted-foreground">
                    You retain ownership of any content you create or submit to our platform. However, 
                    you grant us a license to use, display, and distribute your content as necessary 
                    to provide our services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Third-Party Content</h3>
                  <p className="text-muted-foreground">
                    Some content may be sourced from third parties (like LeetCode problems). We respect 
                    their intellectual property rights and use such content under fair use or with 
                    appropriate permissions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Disclaimers and Limitations</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Service Availability</h3>
                  <p className="text-muted-foreground">
                    We strive to provide reliable service but cannot guarantee 100% uptime. 
                    We may need to perform maintenance or updates that temporarily affect availability.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Educational Purpose</h3>
                  <p className="text-muted-foreground">
                    Our content is for educational purposes only. We do not guarantee specific 
                    learning outcomes or job placement results.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Limitation of Liability</h3>
                  <p className="text-muted-foreground">
                    To the maximum extent permitted by law, we shall not be liable for any indirect, 
                    incidental, special, or consequential damages arising from your use of our service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Termination</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Either party may terminate this agreement at any time:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>You can delete your account and stop using our service</li>
                  <li>We may suspend or terminate accounts for violations of these terms</li>
                  <li>We may discontinue the service with reasonable notice</li>
                  <li>Upon termination, your access to premium features will cease</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Changes to Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of 
                material changes via email or platform notifications. Your continued use of the 
                service after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Governing Law</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of 
                [Your Jurisdiction]. Any disputes arising under these terms shall be resolved 
                through binding arbitration or in the courts of [Your Jurisdiction].
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Contact Information</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-secondary-950/20 rounded-lg">
                <p className="text-sm">
                  <strong>Email:</strong> legal@lazyalgoclub.com<br />
                  <strong>Support:</strong> support@lazyalgoclub.com<br />
                  <strong>Response Time:</strong> Within 72 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 