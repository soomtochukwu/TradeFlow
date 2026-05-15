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
import { useChangeMilestoneStatus, useSendTransaction, useGetEscrowsFromIndexerByRole, useStartDispute } from "@trustless-work/escrow/hooks";
import { Role } from "@trustless-work/escrow";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";
import { Loader2, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SetupWalletBanner } from "@/components/SetupWalletBanner";
import { FileUploader } from "@/components/FileUploader";
import { toast } from "sonner";

export default function ExporterDashboard() {
  const { address, kit } = useWallet();
  const queryClient = useQueryClient();
  const { changeMilestoneStatus } = useChangeMilestoneStatus();
  const { sendTransaction } = useSendTransaction();
  const { getEscrowsByRole } = useGetEscrowsFromIndexerByRole();
  const { startDispute } = useStartDispute();
  
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [evidenceUrl, setEvidenceUrl] = useState<string>("");

  const { data: escrows, isLoading } = useQuery({
    queryKey: ["escrows", "exporter", address],
    queryFn: () => getEscrowsByRole({ role: "serviceProvider" as Role, roleAddress: address || "" }),
    enabled: !!address,
  });

  const handleUpdateStatus = async (contractId: string, milestoneIndex: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address) return;

    const formData = new FormData(e.currentTarget);
    const status = formData.get("status") as string;
    const evidence = evidenceUrl;

    setIsUpdating(`${contractId}-${milestoneIndex}`);
    try {
      const { unsignedTransaction } = await changeMilestoneStatus({
        contractId,
        serviceProvider: address,
        milestoneIndex: milestoneIndex.toString(),
        newStatus: status,
        newEvidence: evidence,
      }, "multi-release");
      if (!unsignedTransaction) throw new Error("Failed to get unsigned transaction");

      const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
        networkPassphrase: Networks.TESTNET,
        address: address,
      });

      await sendTransaction(signedTxXdr);
      toast.success("Status Updated!", {
        description: "Evidence has been submitted. The inspector will be notified."
      });
      
      setEvidenceUrl(""); // Reset for next use
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ["escrows"] }), 5000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleStartDispute = async (contractId: string) => {
    if (!address) return;
    const confirmed = confirm("Are you sure you want to raise a dispute? This will halt the agreement and alert the arbitrator.");
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
        description: "The agreement has been frozen. You will be notified when the arbitrator makes a decision."
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
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Export Shipments</h2>
          <p className="text-muted-foreground">Update milestones and provide evidence for payment release.</p>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : escrows && escrows.length > 0 ? (
            escrows.map((escrow: any) => (
              <Card key={escrow.contractId} className={escrow.flags?.disputed ? "border-red-500/20 bg-red-500/5" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{escrow.title}</CardTitle>
                      <CardDescription className="font-mono text-xs">{escrow.contractId}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                       {escrow.flags?.disputed && <Badge variant="destructive">Disputed</Badge>}
                       <Badge variant={escrow.flags?.funded ? "default" : "secondary"}>
                         {escrow.flags?.funded ? "Funded" : "Unfunded"}
                       </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Milestone</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Evidence</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {escrow.milestones.map((milestone: any, idx: number) => {
                        const isApproved = milestone.flags?.approved;
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{milestone.title}</TableCell>
                            <TableCell>{milestone.amount} USDC</TableCell>
                            <TableCell>
                              {isApproved ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                              ) : (
                                <span className="text-sm italic text-muted-foreground">{milestone.status || "Pending"}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {milestone.evidence ? (
                                <a href={milestone.evidence} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center text-xs">
                                  View Doc <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground">None</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {!isApproved && !escrow.flags?.disputed && (
                                <Dialog>
                                  <DialogTrigger render={<Button size="sm" variant="outline" />}>
                                    Update
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Update Milestone: {milestone.title}</DialogTitle>
                                      <DialogDescription>Provide proof of completion for the inspector to review.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={(e) => handleUpdateStatus(escrow.contractId, idx, e)} className="space-y-4 pt-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="status">Current Status</Label>
                                        <Input id="status" name="status" placeholder="e.g. Goods Shipped" defaultValue={milestone.status} required />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Proof of Completion (IPFS)</Label>
                                        <FileUploader onUploadSuccess={(url) => setEvidenceUrl(url)} />
                                      </div>
                                      <Button type="submit" className="w-full" disabled={isUpdating === `${escrow.contractId}-${idx}` || !evidenceUrl}>
                                        {isUpdating === `${escrow.contractId}-${idx}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                        Submit for Approval
                                      </Button>
                                    </form>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  
                  {escrow.flags?.funded && !escrow.flags?.disputed && !escrow.flags?.released && (
                    <div className="mt-6 flex justify-end">
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleStartDispute(escrow.contractId)}>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Raise Dispute
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-muted-foreground">No active export agreements found.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
