"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit/sdk';
import { Networks } from '@creit.tech/stellar-wallets-kit/types';
import { defaultModules } from '@creit.tech/stellar-wallets-kit/modules/utils';

// We initialize the kit outside or inside the component? 
// The SDK version 2.2.0 uses static methods for the most part, but we can still use the instance pattern if it works.
// Actually, looking at the kit.js, it has static methods.

interface WalletContextType {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  kit: typeof StellarWalletsKit;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    StellarWalletsKit.init({
      modules: defaultModules(),
      network: process.env.NEXT_PUBLIC_USE_MAINNET === 'true'
        ? Networks.PUBLIC
        : Networks.TESTNET,
    });
  }, []);


  const connect = async () => {
    try {
      const { address } = await StellarWalletsKit.authModal();
      setAddress(address);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnect = () => {
    StellarWalletsKit.disconnect();
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ address, connect, disconnect, kit: StellarWalletsKit }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
