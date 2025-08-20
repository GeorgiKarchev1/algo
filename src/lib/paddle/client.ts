'use client';

import { logger } from '../logger';

// Types for Paddle.js
declare global {
  interface Window {
    Paddle: {
      Environment: {
        set: (env: 'sandbox' | 'production') => void;
      };
      Initialize: (options: { 
        token: string;
        eventCallback?: (data: unknown) => void;
      }) => void;
      Checkout: {
        open: (options: {
          product?: number;
          prices?: string[];
          email?: string;
          allowQuantity?: boolean;
          disableLogout?: boolean;
          frameTarget?: string;
          frameInitialHeight?: number;
          frameStyle?: string;
          displayModeTheme?: 'light' | 'dark';
          locale?: string;
          successCallback?: (data: unknown) => void;
          closeCallback?: (data: unknown) => void;
        }) => void;
      };
    };
  }
}

export interface PaddleCheckoutOptions {
  priceIds: string[];
  email?: string;
  allowQuantity?: boolean;
  disableLogout?: boolean;
  displayModeTheme?: 'light' | 'dark';
  locale?: string;
  successCallback?: (data: unknown) => void;
  closeCallback?: (data: unknown) => void;
}

export class PaddleClientService {
  private vendorId: number;
  private environment: 'sandbox' | 'production';
  private isInitialized = false;

  constructor() {
    // Use existing PADDLE_VENDOR_ID (we'll expose it as public)
    this.vendorId = parseInt(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || process.env.PADDLE_VENDOR_ID || '0');
    this.environment = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as 'sandbox' | 'production') || 'production';
    
    // Client-side validation - Client token should be used instead of API key
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
      logger.error('NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set');
    }
    
    if (typeof window !== 'undefined') {
      this.initializePaddle();
    }
  }

  private async initializePaddle() {
    // Wait for Paddle script to load
    let attempts = 0;
    while (!window.Paddle && attempts < 100) { // Increase attempts
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.Paddle) {
      console.error('❌ Paddle.js failed to load after 10 seconds');
      return;
    }

    try {
      // Set environment first
      if (window.Paddle.Environment) {
        window.Paddle.Environment.set(this.environment);
      }
      
      // Get Client Token (not API key!)
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
      if (!clientToken) {
        throw new Error('NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not available');
      }
      
      // Initialize Paddle with the new API
      window.Paddle.Initialize({
        token: clientToken,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        eventCallback: (data: any) => {
          // Handle different events
          if (data.event === 'Checkout.Complete') {
            // Redirect to success page
            window.location.href = `/success?_ptxn=${data.checkout.id}`;
          }
        }
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Paddle:', error);
      console.error('❌ Error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: this.environment,
        hasClientToken: !!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
      });
    }
  }

  public async openCheckout(options: PaddleCheckoutOptions): Promise<void> {
    if (!this.isInitialized) {
      await this.initializePaddle();
    }

    if (!window.Paddle) {
      throw new Error('Paddle.js is not loaded');
    }



    try {
      const checkoutOptions = {
        items: options.priceIds.map(priceId => ({ priceId, quantity: 1 })),
        customer: {
          email: options.email
        },
        settings: {
          allowLogout: !(options.disableLogout ?? true),
          displayMode: 'overlay',
          theme: options.displayModeTheme ?? 'dark',
          locale: options.locale ?? 'en',
          frameTarget: 'self',
          frameInitialHeight: 450,
          frameStyle: 'width: 100%; min-width: 312px; background-color: transparent; border: none;'
        },
        customData: {
          source: 'algochad_website'
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        successCallback: (data: any) => {
          if (options.successCallback) {
            options.successCallback(data);
          } else {
            // Default success behavior - redirect to success page
            window.location.href = `/success?_ptxn=${data.checkout.id}`;
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        closeCallback: (data: any) => {
          if (options.closeCallback) {
            options.closeCallback(data);
          }
        }
      };

      window.Paddle.Checkout.open(checkoutOptions);
    } catch (error) {
      console.error('❌ Failed to open Paddle checkout:', error);
      throw error;
    }
  }

  public isReady(): boolean {
    return this.isInitialized && typeof window !== 'undefined' && !!window.Paddle;
  }
}
