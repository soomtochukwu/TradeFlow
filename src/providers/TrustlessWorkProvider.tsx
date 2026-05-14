"use client";

import { TrustlessWorkConfig, development, mainNet } from '@trustless-work/escrow';

export function TrustlessWorkProvider({ children }: { children: React.ReactNode }) {
  const isMainnet = process.env.NEXT_PUBLIC_USE_MAINNET === 'true';
  return (
    <TrustlessWorkConfig
      baseURL={isMainnet ? mainNet : development}
      apiKey={process.env.NEXT_PUBLIC_API_KEY ?? ''}
    >
      {children}
    </TrustlessWorkConfig>
  );
}
