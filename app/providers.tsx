'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit/OnchainKitProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'viem/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

const queryClient = new QueryClient();

// Determine which chain to use
const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';
const chain = isProduction ? base : baseSepolia;

const wagmiConfig = createConfig({
  chains: [chain],
  connectors: [
    coinbaseWallet({
      appName: 'Piggyfi',
      preference: 'smartWalletOnly', // Use Coinbase Smart Wallet for best UX
    }),
  ],
  ssr: true,
  transports: {
    [chain.id]: http(),
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={chain}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

