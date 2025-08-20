import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import Header from "@/components/ui/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthCallback from "@/components/auth/AuthCallback";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import TestModeToggle from "@/components/ui/TestModeToggle";
import "@/lib/errorHandler";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Lazy Algo Club - Learn DSA Without Trying Too Hard",
  description: "The lazy way to master data structures and algorithms. Daily 1-minute challenges with visual explanations and zero pressure.",
  keywords: ["algorithms", "data structures", "DSA", "coding", "programming", "learning", "education"],
  authors: [{ name: "Lazy Algo Club" }],
  creator: "Lazy Algo Club",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: { url: '/favicon.svg', type: 'image/svg+xml' },
    shortcut: '/favicon.svg'
  },
  openGraph: {
    title: "Lazy Algo Club",
    description: "Learn algorithms without trying too hard. DSA for humans, not grinders.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lazy Algo Club",
    description: "The lazy way to master data structures and algorithms",
  },
  other: {
    "x-robots-tag": "noindex, nofollow",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "x-xss-protection": "1; mode=block",
    "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.paddle.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://*.paddle.com https://checkout-service.paddle.com; frame-src 'self' https://buy.paddle.com https://*.paddle.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; worker-src 'self'; child-src 'self' https://buy.paddle.com https://*.paddle.com;",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script 
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          async
        ></script>
        <style>{`
          /* Custom Paddle Checkout Styling */
          .paddle-popup {
            border-radius: 16px !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
          }
          
          .paddle-popup-inner {
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%) !important;
            border-radius: 16px !important;
          }
          
          .paddle-checkout-container {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          }
          
          .paddle-button-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
          }
          
          .paddle-button-primary:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3) !important;
          }
          
          .paddle-input {
            background: rgba(15, 15, 35, 0.6) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 8px !important;
            color: #ffffff !important;
          }
          
          .paddle-input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          .paddle-checkout-header {
            background: transparent !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          
          .paddle-text-primary {
            color: #ffffff !important;
          }
          
          .paddle-text-secondary {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} antialiased min-h-screen bg-background font-sans`} suppressHydrationWarning={true}>
        <ErrorBoundary>
          <AuthProvider>
            <Suspense fallback={null}>
              <AuthCallback />
            </Suspense>
            <AnimatedBackground />
            <Header />
            <div className="relative z-10 pt-20">
              {children}
            </div>
            <TestModeToggle />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
