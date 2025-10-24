'use client';

import { useState, useEffect } from 'react';
import { Button } from './button';

export interface FarcasterAuthUser {
  fid: number;
  username: string;
  address: string;
  pfpUrl: string;
  displayName: string;
  bio?: string;
}

interface FarcasterAuthProps {
  onSuccess: (user: FarcasterAuthUser) => void;
  onError?: (error: string) => void;
}

export function FarcasterAuth({ onSuccess, onError }: FarcasterAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      // For now, we'll use a simplified flow
      // In production, you'd use @farcaster/auth-kit or similar
      
      // Generate auth URL
      const authUrl = `https://warpcast.com/~/sign-in-with-farcaster`;
      
      // Open popup
      const popup = window.open(
        authUrl,
        'farcaster-auth',
        'width=600,height=700,left=100,top=100'
      );

      // Listen for callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'farcaster-auth-success') {
          window.removeEventListener('message', handleMessage);
          
          // Fetch user details
          const { farcasterClient } = await import('@/lib/farcaster');
          const user = await farcasterClient.lookupUser(event.data.username);
          
          onSuccess(user);
          setIsLoading(false);
        } else if (event.data.type === 'farcaster-auth-error') {
          window.removeEventListener('message', handleMessage);
          const errorMsg = event.data.error || 'Authentication failed';
          setError(errorMsg);
          onError?.(errorMsg);
          setIsLoading(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Timeout after 5 minutes
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        if (isLoading) {
          setError('Authentication timed out');
          onError?.('Authentication timed out');
          setIsLoading(false);
        }
      }, 5 * 60 * 1000);

    } catch (err: any) {
      const errorMsg = err.message || 'Failed to authenticate';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsLoading(false);
    }
  };

  // Simplified fallback: manual username entry
  const [showManual, setShowManual] = useState(false);
  const [manualUsername, setManualUsername] = useState('');

  const handleManualAuth = async () => {
    if (!manualUsername.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { farcasterClient } = await import('@/lib/farcaster');
      const user = await farcasterClient.lookupUser(manualUsername);
      onSuccess(user);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to find user';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (showManual) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enter Your Farcaster Username
          </h3>
          <p className="text-sm text-gray-600">
            We'll fetch your profile and wallet address
          </p>
        </div>

        <input
          type="text"
          placeholder="@username"
          value={manualUsername}
          onChange={(e) => setManualUsername(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleManualAuth();
            }
          }}
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowManual(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleManualAuth}
            disabled={isLoading || !manualUsername.trim()}
            className="flex-1"
          >
            {isLoading ? 'Looking up...' : 'Continue'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🎭</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Sign in with Farcaster
        </h3>
        <p className="text-sm text-gray-600">
          Connect your Farcaster account to join this piggybank
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <Button
        variant="primary"
        onClick={() => setShowManual(true)}
        disabled={isLoading}
        className="w-full text-lg py-4"
      >
        {isLoading ? '⏳ Connecting...' : '🎭 Enter Farcaster Username'}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Your wallet address will be automatically fetched from your Farcaster profile
      </p>
    </div>
  );
}

