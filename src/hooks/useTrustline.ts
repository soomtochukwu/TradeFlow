"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
const HORIZON_URL = "https://horizon-testnet.stellar.org";

export function useTrustline(address: string | null) {
  const [hasUSDC, setHasUSDC] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkTrustline = useCallback(async () => {
    if (!address) {
      setHasUSDC(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${HORIZON_URL}/accounts/${address}`);
      const balances = response.data.balances;
      const usdcBalance = balances.find((b: any) => 
        b.asset_code === "USDC" && b.asset_issuer === USDC_ISSUER
      );
      setHasUSDC(!!usdcBalance);
    } catch (error) {
      console.error("Failed to check trustline:", error);
      // If account doesn't exist yet, it definitely doesn't have a trustline
      setHasUSDC(false);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    checkTrustline();
  }, [checkTrustline]);

  return { hasUSDC, isLoading, refresh: checkTrustline };
}
