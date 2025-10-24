'use client';

import React, { useEffect } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';

interface WalletConnectionProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const { address, isConnected } = useAccount();

  // Notify parent component of connection changes
  useEffect(() => {
    if (isConnected && address) {
      onConnect(address);
    } else {
      onDisconnect();
    }
  }, [isConnected, address, onConnect, onDisconnect]);

  return (
    <div className="flex items-center gap-3">
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className="text-gray-500" />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
