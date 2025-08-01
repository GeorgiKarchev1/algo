'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleAuthCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (error) {
        console.error('Auth error:', error, errorDescription);
        // Remove error params from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('error');
        newUrl.searchParams.delete('error_description');
        router.replace(newUrl.pathname + newUrl.search);
        return;
      }

      if (code) {
        try {
          // Refresh user data to get updated session
          await refreshUser();
          
          // Remove code param from URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('code');
          router.replace(newUrl.pathname + newUrl.search);
        } catch (error) {
          console.error('Error handling auth callback:', error);
        }
      }
    };

    // Only run if there are auth-related URL parameters
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    if (code || error) {
      handleAuthCallback();
    }
  }, [searchParams, router, refreshUser]);

  return null;
} 