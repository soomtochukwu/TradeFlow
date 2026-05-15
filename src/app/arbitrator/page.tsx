"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useWallet } from "@/providers/WalletProvider";
import { useResolveDispute, useSendTransaction, useGetEscrowsFromIndexerByRole } from "@trustless-work/escrow/hooks";
import { Role } from "@trustless-work/escrow";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";
import { Loader2, Gavel, Scale, AlertTriangle, ExternalLink } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SetupWalletBanner } from "@/components/SetupWalletBanner";
import { toast } from "sonner";

export default function ArbitratorDashboard() {
  const { address, kit } = useWallet();
  const queryClient = useQueryClient();
  const { resolveDispute } = useResolveDispute();
  const { sendTransaction } = useSendTransaction();
  const { getEscrowsByRole } = useGetEscrowsFromIndexerByRole();

  const [isResolving, setIsResolving] = useState<string | null>(null);

  const { data: escrows, isLoading } = useQuery({
    queryKey: ["escrows", "arbitrator", address],
    queryFn: () => getEscrowsByRole({ role: "disputeResolver" as Role, roleAddress: address || "" }),
    enabled: !!address,
  });

  const handleResolve = async (e: React.FormEvent<HTMLFormElement>, contractId: string, milestoneIndex: number, roles: any) => {
    e.preventDefault();
    if (!address) return;

    const formData = new FormData(e.currentTarget);
    const serviceProviderAmount = Number(formData.get("serviceProviderAmount"));
    const approverAmount = Number(formData.get("approverAmount"));

    setIsResolving(`${contractId}-${milestoneIndex}`);
    try {
      const { unsignedTransaction } = await resolveDispute({
        contractId,
        disputeResolver: address,
        milestoneIndex: milestoneIndex.toString(),
        distributions: [
          { amount: serviceProviderAmount, address: roles.serviceProvider },
          { amount: approverAmount, address: roles.approver }
        ] as any
      }, "multi-release");
      
      if (!unsignedTransaction) throw new Error("Failed to get unsigned transaction");

      const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
        networkPassphrase: Networks.TESTNET,
        address: address,
      });

      await sendTransaction(signedTxXdr);
      toast.success("Dispute Resolved!", {
        description: `Milestone #${milestoneIndex + 1} funds have been distributed.`
      });
      
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ["escrows"] }), 5000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to resolve dispute");
    } finally {
      setIsResolving(null);
    }
  };

  const disputedEscrows = escrows?.filter((e: any) => 
    e.milestones.some((m: any) => m.flags?.disputed && !m.flags?.resolved)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SetupWalletBanner />
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Legal Arbitration</h2>
          <p className="text-muted-foreground font-medium">Resolve contested trade agreements and distribute locked capital.</p>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : disputedEscrows && disputedEscrows.length > 0 ? (
            disputedEscrows.map((escrow: any) => {
              return (
                <Card key={escrow.contractId} className="border-red-500/20 bg-red-500/5 backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Gavel className="h-5 w-5 text-red-500" />
                          <CardTitle className="uppercase tracking-tighter italic font-black text-xl">Dispute: {escrow.title}</CardTitle>
                        </div>
                        <CardDescription className="font-mono text-[10px] opacity-50 uppercase tracking-widest">{escrow.contractId}</CardDescription>
                      </div>
                      <Badge variant="destructive" className="animate-pulse font-black uppercase text-[10px] tracking-widest">Active Dispute</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="uppercase text-[10px] font-black tracking-widest opacity-50">Milestone</TableHead>
                          <TableHead className="uppercase text-[10px] font-black tracking-widest opacity-50">Amount</TableHead>
                          <TableHead className="uppercase text-[10px] font-black tracking-widest opacity-50">Evidence</TableHead>
                          <TableHead className="text-right uppercase text-[10px] font-black tracking-widest opacity-50">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {escrow.milestones.map((m: any, i: number) => {
                          const isDisputed = m.flags?.disputed && !m.flags?.resolved;
                          return (
                            <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors">
                              <TableCell className="font-bold tracking-tight">
                                {m.title}
                                {isDisputed && <div className="text-[10px] text-red-500 font-black uppercase mt-1 italic tracking-widest">Halted by Conflict</div>}
                              </TableCell>
                              <TableCell className="font-mono font-bold text-primary">{m.amount} USDC</TableCell>
                              <TableCell>
                                {m.evidence ? (
                                  <a href={m.evidence} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-bold flex items-center text-xs transition-colors">
                                    Review Proof <ExternalLink className="ml-1.5 h-3 w-3" />
                                  </a>
                                ) : (
                                  <span className="opacity-30 italic text-xs">No Proof Found</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {isDisputed && (
                                  <Sheet>
                                    <SheetTrigger render={<Button size="sm" variant="destructive" className="h-9 px-6 font-black uppercase text-[10px] tracking-widest glow-primary">
                                      Issue Judgment
                                    </Button>} />
                                    <SheetContent className="sm:max-w-xl glass-dark border-white/5">
                                      <div className="space-y-8 pt-8 px-4">
                                        <div>
                                          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Arbitration Ruling</h3>
                                          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold opacity-70">Milestone: {m.title}</p>
                                          <p className="text-sm text-muted-foreground mt-4 leading-relaxed font-medium">
                                            As the assigned arbitrator, you must distribute the <b>{m.amount} USDC</b> currently locked in this milestone.
                                          </p>
                                        </div>

                                        <form onSubmit={(e) => handleResolve(e, escrow.contractId, i, escrow.roles)} className="space-y-6">
                                          <div className="space-y-3">
                                            <Label htmlFor="serviceProviderAmount" className="uppercase text-[10px] font-black tracking-widest opacity-50">Exporter Distribution</Label>
                                            <Input id="serviceProviderAmount" name="serviceProviderAmount" type="number" step="0.01" placeholder="0.00" required className="h-14 bg-white/5 border-white/10 rounded-xl font-bold text-lg px-6" />
                                            <div className="flex items-center gap-2 px-2">
                                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                              <p className="text-[10px] text-muted-foreground font-mono truncate">{escrow.roles.serviceProvider}</p>
                                            </div>
                                          </div>
                                          
                                          <div className="space-y-3">
                                            <Label htmlFor="approverAmount" className="uppercase text-[10px] font-black tracking-widest opacity-50">Importer Refund</Label>
                                            <Input id="approverAmount" name="approverAmount" type="number" step="0.01" placeholder="0.00" required className="h-14 bg-white/5 border-white/10 rounded-xl font-bold text-lg px-6" />
                                            <div className="flex items-center gap-2 px-2">
                                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                              <p className="text-[10px] text-muted-foreground font-mono truncate">{escrow.roles.approver}</p>
                                            </div>
                                          </div>

                                          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4">
                                            <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-amber-500/90 leading-relaxed font-bold uppercase tracking-widest mb-1">On-Chain Finality</p>
                                              <p className="text-[11px] text-amber-500/70 leading-relaxed font-medium">
                                                Total distribution must exactly equal {m.amount} USDC. This ruling is irreversible once signed.
                                              </p>
                                            </div>
                                          </div>

                                          <Button 
                                            type="submit" 
                                            className="w-full h-16 glow-primary rounded-full font-black uppercase italic tracking-tighter text-xl mt-4"
                                            disabled={isResolving === `${escrow.contractId}-${i}`}
                                          >
                                            {isResolving === `${escrow.contractId}-${i}` ? (
                                              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                            ) : (
                                              <Scale className="mr-3 h-6 w-6" />
                                            )}
                                            Finalize Ruling
                                          </Button>
                                        </form>
                                      </div>
                                    </SheetContent>
                                  </Sheet>
                                )}
                                {m.flags?.resolved && <Badge className="bg-green-500/20 text-green-500 border-green-500/30 uppercase text-[10px] font-black tracking-widest italic">Resolved</Badge>}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
              <div className="relative inline-block mb-6">
                <Scale className="h-16 w-16 mx-auto text-muted-foreground opacity-10" />
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10" />
              </div>
              <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-sm italic">Clear Docket: No pending disputes</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
