'use client';

import { useEffect, useState } from 'react';

export default function EnvTest() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Test all environment variables
    const testEnvVars = {
      'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
        `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT_SET',
      'PADDLE_API_KEY': process.env.PADDLE_API_KEY ? 
        `${process.env.PADDLE_API_KEY.substring(0, 20)}...` : 'NOT_SET',
      'PADDLE_WEBHOOK_SECRET': process.env.PADDLE_WEBHOOK_SECRET ? 
        `${process.env.PADDLE_WEBHOOK_SECRET.substring(0, 20)}...` : 'NOT_SET',
      'PADDLE_VENDOR_ID': process.env.PADDLE_VENDOR_ID || 'NOT_SET',
      'PADDLE_ENVIRONMENT': process.env.PADDLE_ENVIRONMENT || 'NOT_SET',
      'PADDLE_CASUAL_PRICE_ID': process.env.PADDLE_CASUAL_PRICE_ID || 'NOT_SET',
      'PADDLE_GIGACHAD_PRICE_ID': process.env.PADDLE_GIGACHAD_PRICE_ID || 'NOT_SET',
      'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL || 'NOT_SET',
    };

    setEnvVars(testEnvVars);

    // Log to console
    console.log('=== ENVIRONMENT VARIABLES TEST ===');
    Object.entries(testEnvVars).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
    console.log('==================================');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Environment Variables Test</h1>
        
        <div className="grid gap-4">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-400 mb-2">{key}</h3>
              <p className="text-sm font-mono bg-gray-700 p-2 rounded">
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {value === 'NOT_SET' ? '❌ Missing' : '✅ Set'}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-900 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Отворете Developer Tools (F12)</li>
            <li>Отидете на Console таб</li>
            <li>Проверете логовете за environment variables</li>
            <li>Сравнете с очакваните стойности</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 