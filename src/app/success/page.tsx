'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, User, Calendar, CreditCard } from 'lucide-react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [transactionData, setTransactionData] = useState<{
    transactionId?: string;
    status?: string;
    customerEmail?: string;
    amount?: string;
    currency?: string;
  }>({});

  useEffect(() => {
    // Extract transaction data from URL parameters
    const txnId = searchParams.get('_ptxn');
    const status = searchParams.get('status');
    const email = searchParams.get('customer_email');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');

    setTransactionData({
      transactionId: txnId || undefined,
      status: status || undefined,
      customerEmail: email || undefined,
      amount: amount || undefined,
      currency: currency || undefined,
    });

    // Log transaction completion for analytics/debugging
    if (txnId) {
      console.log('🎉 Transaction completed:', {
        transactionId: txnId,
        status,
        timestamp: new Date().toISOString(),
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-8 text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-500/20 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Welcome to the Lazy Algo Club! Your subscription is now active.
        </p>

        {/* Transaction Details */}
        {transactionData.transactionId && (
          <div className="bg-background/30 rounded-lg p-4 mb-6 space-y-3">
            <h3 className="font-semibold text-foreground mb-3">Transaction Details</h3>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Transaction ID:</span>
              </div>
              <span className="font-mono text-xs bg-background/50 px-2 py-1 rounded">
                {transactionData.transactionId.substring(0, 16)}...
              </span>
            </div>

            {transactionData.customerEmail && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                </div>
                <span className="text-foreground">{transactionData.customerEmail}</span>
              </div>
            )}

            {transactionData.amount && transactionData.currency && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Amount:</span>
                </div>
                <span className="text-foreground font-semibold">
                  ${transactionData.amount} {transactionData.currency?.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* What's Next */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                      <h3 className="font-semibold text-blue-400 mb-2">What&apos;s Next?</h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• Check your email for confirmation</li>
            <li>• Access your account dashboard</li>
            <li>• Start with the Junior Track</li>
            <li>• Join our Discord community</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/junior"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
          >
            Start Learning 🚀
          </Link>
          
          <Link 
            href="/problems"
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 px-6 rounded-lg transition-colors inline-block"
          >
            Browse Problems 📚
          </Link>
          
          <Link 
            href="/"
            className="w-full border border-border hover:bg-accent text-foreground font-medium py-3 px-6 rounded-lg transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Questions? Contact us at{' '}
            <a href="mailto:support@algochad.com" className="text-primary hover:underline">
              support@algochad.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/20 rounded-full p-4 animate-pulse">
              <CheckCircle className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Loading...
          </h1>
          <p className="text-muted-foreground">
            Processing your transaction details...
          </p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}