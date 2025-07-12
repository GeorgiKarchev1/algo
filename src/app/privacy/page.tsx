import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield, Eye, Lock, Database, Mail, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary-950/20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary-400" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
                      <p className="text-xl text-muted-foreground">
              Your privacy is important to us. Here&apos;s how we protect your data.
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
          {/* Introduction */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Introduction</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Lazy Algo Club (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                information when you use our platform, including our website and services.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Information We Collect</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Email address (for account creation and communication)</li>
                    <li>Username and display name</li>
                    <li>Profile information you choose to provide</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Problems you solve and your progress</li>
                    <li>Time spent on the platform</li>
                    <li>Features you use and interactions with content</li>
                    <li>Device information and browser type</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>IP address and location data</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Log files and analytics data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide and maintain our services</li>
                <li>Personalize your learning experience</li>
                <li>Track your progress and provide recommendations</li>
                <li>Communicate with you about your account and updates</li>
                <li>Process payments and manage subscriptions</li>
                <li>Improve our platform and develop new features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Data Sharing and Disclosure</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Data Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, or 
                destruction. This includes encryption, secure servers, and regular security audits.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Your Rights</h2>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and provide personalized content. You can control cookie preferences through your 
                browser settings.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium">Types of cookies we use:</p>
                <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                  <li>Essential cookies for platform functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-semibold">Contact Us</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us at:
              </p>
              <div className="mt-4 p-4 bg-secondary-950/20 rounded-lg">
                <p className="text-sm">
                  <strong>Email:</strong> privacy@lazyalgoclub.com<br />
                  <strong>Response Time:</strong> Within 72 hours
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any 
                material changes by posting the new Privacy Policy on this page and updating the 
                &quot;Last updated&quot; date. Your continued use of our services after any changes 
                constitutes acceptance of the new Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 