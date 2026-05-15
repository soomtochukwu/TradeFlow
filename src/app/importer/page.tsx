"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useWallet } from "@/providers/WalletProvider";
import { useInitializeEscrow, useSendTransaction, useGetEscrowsFromIndexerByRole, useFundEscrow, useStartDispute } from "@trustless-work/escrow/hooks";
import { Role } from "@trustless-work/escrow";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";
import { Plus, Wallet, Loader2, Ship, AlertTriangle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SetupWalletBanner } from "@/components/SetupWalletBanner";
import { toast } from "sonner";

const USDC_ISSUER = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"; // Testnet USDC

export default function ImporterDashboard() {
  const { address, kit } = useWallet();
  const queryClient = useQueryClient();
  const { deployEscrow } = useInitializeEscrow();
  const { sendTransaction } = useSendTransaction();
  const { fundEscrow } = useFundEscrow();
  const { getEscrowsByRole } = useGetEscrowsFromIndexerByRole();
  const { startDispute } = useStartDispute();
  
  const [isDeploying, setIsDeploying] = useState(false);
  const [isFunding, setIsFunding] = useState<string | null>(null);

  const { data: escrows, isLoading } = useQuery({
    queryKey: ["escrows", "issuer", address],
    queryFn: () => getEscrowsByRole({ role: "issuer" as Role, roleAddress: address || "" }),
    enabled: !!address,
  });

  const handleCreateAgreement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address) return;

    setIsDeploying(true);
    const formData = new FormData(e.currentTarget);
    const exporterAddress = formData.get("exporter") as string;
    const inspectorAddress = formData.get("inspector") as string;
    const arbitratorAddress = formData.get("arbitrator") as string;
    const totalAmount = Number(formData.get("amount"));

    try {
      const payload = {
        signer: address,
        engagementId: `trade-${Date.now()}`,
        title: "Trade Agreement: Cross-Border Electronics",
        description: "Standard Letter of Credit for electronics export",
        roles: {
          approver: inspectorAddress,
          serviceProvider: exporterAddress,
          releaseSigner: address,
          disputeResolver: arbitratorAddress || address,
          platformAddress: address,
        },
        platformFee: 0,
        trustline: {
          address: USDC_ISSUER,
          symbol: "USDC",
        },
        milestones: [
          { 
            title: "M1: Production", 
            description: "Raw materials secured", 
            amount: totalAmount * 0.2, 
            receiver: exporterAddress 
          },
          { 
            title: "M2: Logistics", 
            description: "Goods loaded onto ship", 
            amount: totalAmount * 0.4, 
            receiver: exporterAddress 
          },
          { 
            title: "M3: Delivery", 
            description: "Goods arrived & inspected", 
            amount: totalAmount * 0.4, 
            receiver: exporterAddress 
          },
        ],
      };

      const { unsignedTransaction } = await deployEscrow(payload as any, "multi-release");
      if (!unsignedTransaction) throw new Error("Failed to get unsigned transaction");

      const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
        networkPassphrase: Networks.TESTNET,
        address: address,
      });

      await sendTransaction(signedTxXdr);
      toast.success("Agreement Deployed!", {
        description: "The transaction has been submitted to Stellar. The dashboard will update in a few seconds."
      });
      
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ["escrows"] }), 5000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to deploy agreement");
    } finally {
      setIsDeploying(false);
    }
  };

  const handleFund = async (contractId: string, amount: number) => {
    if (!address) return;
    setIsFunding(contractId);
    try {
      const { unsignedTransaction } = await fundEscrow({
        contractId,
        signer: address,
        amount: amount,
      }, "multi-release");
      if (!unsignedTransaction) throw new Error("Failed to get unsigned transaction");

      const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
        networkPassphrase: Networks.TESTNET,
        address: address,
      });

      await sendTransaction(signedTxXdr);
      toast.success("Escrow Funded!", {
        description: "Your USDC has been locked. The status will update shortly."
      });
      
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ["escrows"] }), 5000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fund escrow");
    } finally {
      setIsFunding(null);
    }
  };

  const handleStartDispute = async (contractId: string) => {
    if (!address) return;
    const confirmed = confirm("Are you sure you want to raise a dispute? This will halt all payments and require legal arbitration.");
    if (!confirmed) return;

    try {
      const { unsignedTransaction } = await startDispute({
        contractId,
        signer: address,
      }, "multi-release");
      
      if (!unsignedTransaction) throw new Error("Failed to get unsigned transaction");

      const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
        networkPassphrase: Networks.TESTNET,
        address: address,
      });

      await sendTransaction(signedTxXdr);
      toast.success("Dispute Raised", {
        description: "The agreement has been frozen. An arbitrator will review the case."
      });
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ["escrows"] }), 5000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to raise dispute");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SetupWalletBanner />
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Active Agreements</h2>
            <p className="text-muted-foreground">Manage your cross-border trade letters of credit.</p>
          </div>
          <Dialog>
            <DialogTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" /> New Agreement
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Trade Agreement</DialogTitle>
                <DialogDescription>
                  Initialize a new multi-release escrow for your trade.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAgreement} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="exporter">Exporter Address</Label>
                  <Input id="exporter" name="exporter" placeholder="G..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspector">Inspector Address</Label>
                  <Input id="inspector" name="inspector" placeholder="G..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arbitrator">Arbitrator Address (Optional)</Label>
                  <Input id="arbitrator" name="arbitrator" placeholder="G... (Defaults to you)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Total Amount (USDC)</Label>
                  <Input id="amount" name="amount" type="number" placeholder="5000" required />
                </div>
                <Button type="submit" className="w-full" disabled={isDeploying}>
                  {isDeploying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ship className="mr-2 h-4 w-4" />}
                  Deploy Agreement
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : escrows && escrows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agreement</TableHead>
                    <TableHead>Exporter</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {escrows.map((escrow: any) => {
                     const totalAmount = escrow.milestones.reduce((acc: number, m: any) => acc + (m.amount || 0), 0);
                     const isFunded = escrow.flags?.funded;
                     const isDisputed = escrow.flags?.disputed;
                     return (
                      <TableRow key={escrow.contractId}>
                        <TableCell>
                          <div className="font-medium">{escrow.title}</div>
                          <div className="text-xs text-muted-foreground font-mono">{escrow.contractId}</div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {escrow.roles.serviceProvider.slice(0, 6)}...{escrow.roles.serviceProvider.slice(-4)}
                        </TableCell>
                        <TableCell>{totalAmount} USDC</TableCell>
                        <TableCell>
                          {isDisputed ? (
                            <Badge variant="destructive">Disputed</Badge>
                          ) : (
                            <Badge className={isFunded ? "bg-green-100 text-green-800" : ""}>
                              {isFunded ? "Funded" : "Pending Funding"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!isFunded && (
                              <Button 
                                size="sm" 
                                onClick={() => handleFund(escrow.contractId, totalAmount)}
                                disabled={isFunding === escrow.contractId}
                              >
                                {isFunding === escrow.contractId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
                                Fund
                              </Button>
                            )}
                            {isFunded && !isDisputed && !escrow.flags?.released && (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleStartDispute(escrow.contractId)}
                              >
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Dispute
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No agreements found. Create your first one!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
