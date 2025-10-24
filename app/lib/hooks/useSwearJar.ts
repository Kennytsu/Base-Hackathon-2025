import { useAccount, useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useState, useEffect } from 'react';

// SwearJar ABI (add only the functions we need)
const SWEAR_JAR_ABI = [
  {
    type: 'function',
    name: 'depositBond',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'withdrawBond',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'applyPenalty',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'withdrawPot',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getBond',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getPotBalance',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getNonce',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'BondDeposited',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ViolationPenalty',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'PotWithdrawn',
    inputs: [
      { name: 'recipient', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
] as const;

// Contract address from environment
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '') as `0x${string}`;

export function useSwearJar() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read user's bond balance
  const { data: bondBalance, refetch: refetchBond } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SWEAR_JAR_ABI,
    functionName: 'getBond',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read pot balance
  const { data: potBalance, refetch: refetchPot } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SWEAR_JAR_ABI,
    functionName: 'getPotBalance',
  });

  // Watch for events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: SWEAR_JAR_ABI,
    eventName: 'BondDeposited',
    onLogs() {
      refetchBond();
      refetchPot();
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: SWEAR_JAR_ABI,
    eventName: 'ViolationPenalty',
    onLogs() {
      refetchBond();
      refetchPot();
    },
  });

  // Deposit bond
  const depositBond = async (amountInEth: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      setError(null);
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SWEAR_JAR_ABI,
        functionName: 'depositBond',
        value: parseEther(amountInEth),
      });
      
      await refetchBond();
      return hash;
    } catch (err: any) {
      setError(err.message || 'Failed to deposit bond');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw bond
  const withdrawBond = async (amountInEth: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      setError(null);
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SWEAR_JAR_ABI,
        functionName: 'withdrawBond',
        args: [parseEther(amountInEth)],
      });
      
      await refetchBond();
      return hash;
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw bond');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Apply penalty (owner only)
  const applyPenalty = async (userAddress: `0x${string}`, amountInEth: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SWEAR_JAR_ABI,
        functionName: 'applyPenalty',
        args: [userAddress, parseEther(amountInEth)],
      });
      
      await refetchBond();
      await refetchPot();
      return hash;
    } catch (err: any) {
      setError(err.message || 'Failed to apply penalty');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw pot (owner only)
  const withdrawPot = async (toAddress: `0x${string}`, amountInEth: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: SWEAR_JAR_ABI,
        functionName: 'withdrawPot',
        args: [toAddress, parseEther(amountInEth)],
      });
      
      await refetchPot();
      return hash;
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw pot');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    address,
    bondBalance: bondBalance ? formatEther(bondBalance) : '0',
    potBalance: potBalance ? formatEther(potBalance) : '0',
    depositBond,
    withdrawBond,
    applyPenalty,
    withdrawPot,
    isLoading,
    error,
    refetchBond,
    refetchPot,
  };
}

