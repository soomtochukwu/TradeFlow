"use client";

import { useWallet } from "@/providers/WalletProvider";
import { useTrustline } from "@/hooks/useTrustline";
import { AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function SetupWalletBanner() {
  const { address } = useWallet();
  const { hasUSDC, isLoading, refresh } = useTrustline(address);

  if (!address || hasUSDC === true || hasUSDC === null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="mb-8"
      >
        <Card className="border-amber-500/50 bg-amber-500/5 p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">USDC Trustline Required</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Your wallet is not configured to receive or hold USDC on the Stellar Testnet. 
                  You must add the trustline manually in your wallet to use TradeFlow.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="flex-1 md:flex-none border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                onClick={() => window.open("https://docs.trustlesswork.com/trustless-work/trustlines", "_blank")}
              >
                How to add <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-600 text-white font-bold"
                onClick={refresh}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                I've added it
              </Button>
            </div>
          </div>
          
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -mr-16 -mt-16 rounded-full" />
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
