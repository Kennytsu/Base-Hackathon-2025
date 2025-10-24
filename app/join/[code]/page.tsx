'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/app/components/button';
import { FarcasterAuth, FarcasterAuthUser } from '@/app/components/farcaster-auth';
import { useSwearJar } from '@/lib/hooks/useSwearJar';
import { Piggybank } from '@/lib/types';
import { formatEth } from '@/lib/utils';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { depositBond, isLoading } = useSwearJar();
  
  const inviteCode = params.code as string;
  const [piggybank, setPiggybank] = useState<Piggybank | null>(null);
  const [farcasterUser, setFarcasterUser] = useState<FarcasterAuthUser | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Load piggybank from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('piggies');
    if (stored) {
      const piggies: Piggybank[] = JSON.parse(stored);
      const found = piggies.find(p => p.inviteCode === inviteCode);
      if (found) {
        setPiggybank(found);
        
        // Check if user is already a member (by address or FID)
        if (farcasterUser) {
          const alreadyMember = found.members.some(m => 
            m.address?.toLowerCase() === farcasterUser.address.toLowerCase() ||
            m.fid === farcasterUser.fid
          );
          if (alreadyMember) {
            setStatus('✅ You are already a member of this piggybank!');
          }
        }
      } else {
        setError('Piggybank not found. The invite link may be invalid or expired.');
      }
    } else {
      setError('No piggybanks found. The creator needs to share an active piggybank.');
    }
  }, [inviteCode, farcasterUser]);

  const handleFarcasterAuth = (user: FarcasterAuthUser) => {
    setFarcasterUser(user);
    setError('');
  };

  const handleJoin = async () => {
    if (!farcasterUser) {
      setError('Please sign in with Farcaster first');
      return;
    }

    if (!piggybank) {
      setError('Piggybank not found');
      return;
    }

    // Check if already a member
    const alreadyMember = piggybank.members.some(m => 
      m.address?.toLowerCase() === farcasterUser.address.toLowerCase() ||
      m.fid === farcasterUser.fid
    );
    
    if (alreadyMember) {
      setStatus('✅ You are already a member!');
      return;
    }

    setIsJoining(true);
    setStatus('💰 Depositing entry stake...');
    setError('');

    try {
      // Deposit bond to smart contract
      await depositBond(piggybank.entryStakeEth.toString());
      setStatus('✅ Deposit successful! Adding you to the group...');

      // Add member to piggybank with Farcaster data
      const updatedPiggybank: Piggybank = {
        ...piggybank,
        members: [
          ...piggybank.members,
          {
            id: `${Date.now()}-${farcasterUser.fid}`,
            name: farcasterUser.displayName,
            address: farcasterUser.address,
            avatarHue: Math.floor(Math.random() * 360),
            breaks: 0,
            fid: farcasterUser.fid,
            pfpUrl: farcasterUser.pfpUrl,
            farcasterUsername: `@${farcasterUser.username}`,
          },
        ],
        potEth: piggybank.potEth + piggybank.entryStakeEth,
      };

      // Update in localStorage
      const stored = localStorage.getItem('piggies');
      if (stored) {
        const piggies: Piggybank[] = JSON.parse(stored);
        const updatedPiggies = piggies.map(p =>
          p.inviteCode === inviteCode ? updatedPiggybank : p
        );
        localStorage.setItem('piggies', JSON.stringify(updatedPiggies));
      }

      setStatus('🎉 Success! You have joined the piggybank!');
      
      // Redirect to main app after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      console.error('Failed to join piggybank:', err);
      let errorMessage = 'Failed to join piggybank';
      if (err.message?.includes('user rejected')) {
        errorMessage = 'Transaction cancelled';
      } else if (err.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds in wallet';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(`❌ ${errorMessage}`);
    } finally {
      setIsJoining(false);
    }
  };

  if (error && !piggybank) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Piggybank Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button variant="primary" onClick={() => router.push('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!piggybank) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/20 shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Piggyfi
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🏦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Piggybank</h1>
            <p className="text-gray-600">You've been invited to join a savings group!</p>
          </div>

          {/* Piggybank Details */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{piggybank.name}</h2>
            {piggybank.theme && (
              <p className="text-gray-600 mb-4">{piggybank.theme}</p>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-sm text-gray-600">Entry Stake</div>
                <div className="text-xl font-bold text-blue-600">{formatEth(piggybank.entryStakeEth)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Members</div>
                <div className="text-xl font-bold text-purple-600">{piggybank.members.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Pot</div>
                <div className="text-xl font-bold text-green-600">{formatEth(piggybank.potEth)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Rules</div>
                <div className="text-xl font-bold text-orange-600">{piggybank.rules.length}</div>
              </div>
            </div>
          </div>

          {/* Rules */}
          {piggybank.rules.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Group Rules</h3>
              <div className="space-y-2">
                {piggybank.rules.map(rule => (
                  <div key={rule.id} className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-gray-700">{rule.label}</span>
                    <span className="text-sm font-semibold text-red-600">Penalty: {formatEth(rule.penaltyEth)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Messages */}
          {status && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-center">
              {status}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {!farcasterUser ? (
              <FarcasterAuth onSuccess={handleFarcasterAuth} onError={setError} />
            ) : piggybank.members.some(m => 
              m.address?.toLowerCase() === farcasterUser.address.toLowerCase() ||
              m.fid === farcasterUser.fid
            ) ? (
              <div className="text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <img 
                    src={farcasterUser.pfpUrl} 
                    alt={farcasterUser.displayName}
                    className="w-16 h-16 rounded-full border-2 border-green-500"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{farcasterUser.displayName}</div>
                    <div className="text-sm text-purple-600">@{farcasterUser.username}</div>
                  </div>
                </div>
                <p className="text-green-600 font-semibold mb-4">✅ You are already a member!</p>
                <Button variant="primary" onClick={() => router.push('/')} className="w-full">
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <img 
                    src={farcasterUser.pfpUrl} 
                    alt={farcasterUser.displayName}
                    className="w-12 h-12 rounded-full border-2 border-purple-500"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{farcasterUser.displayName}</div>
                    <div className="text-sm text-purple-600">@{farcasterUser.username}</div>
                    <div className="text-xs text-gray-500 font-mono">{farcasterUser.address.slice(0, 6)}...{farcasterUser.address.slice(-4)}</div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="w-full text-lg py-4"
                >
                  {isJoining ? '⏳ Joining...' : `💰 Deposit ${formatEth(piggybank.entryStakeEth)} & Join`}
                </Button>
                <p className="text-center text-sm text-gray-500">
                  By joining, you agree to the group rules and will deposit {formatEth(piggybank.entryStakeEth)} as your entry stake.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

