"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/providers/WalletProvider";
import { useApproveMilestone, useSendTransaction, useGetEscrowsFromIndexerByRole } from "@trustless-work/escrow/hooks";
import { Role } from "@trustless-work/escrow";
import { Networks } from "@creit.tech/stellar-wallets-kit/types";
import { Loader2, ExternalLink, ShieldCheck, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function InspectorDashboard() {
  const { address, kit } = useWallet();
  const { approveMilestone } = useApproveMilestone();
  const { sendTransaction } = useSendTransaction();
  const { getEscrowsByRole } = useGetEscrowsFromIndexerByRole();

  const [isApproving, setIsApproving] = useState<string | null>(null);

  const { data: escrows, isLoading } = useQuery({
    queryKey: ["escrows", "inspector", address],
    queryFn: () => getEscrowsByRole({ role: "approver" as Role, roleAddress: address || "" }),
    enabled: !!address,
  });


  const handleApprove = async (contractId: string, milestoneIndex: number) => {
    if (!address) return;
    
    const confirmed = confirm("Are you sure you want to approve this milestone? This will release funds and cannot be undone.");
    if (!confirmed) return;

    setIsApproving(`${contractId}-${milestoneIndex}`);
    try {
      const { unsignedTransaction } = await approveMilestone({
        contractId,
        approver: address,
        milestoneIndex: milestoneIndex.toString(),
      }, "multi-release");
      if (!unsignedTransaction) throw new Error("Failed to get unsigned transaction");

      const { signedTxXdr } = await kit.signTransaction(unsignedTransaction, {
        networkPassphrase: Networks.TESTNET,
        address: address,
      });

      await sendTransaction(signedTxXdr);
      alert("Milestone Approved Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to approve milestone");
    } finally {
      setIsApproving(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inspection Queue</h2>
          <p className="text-muted-foreground">Review evidence and verify trade milestones for payment release.</p>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : escrows && escrows.length > 0 ? (
            escrows.map((escrow: any) => (
              <Card key={escrow.contractId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{escrow.title}</CardTitle>
                      <CardDescription className="font-mono text-xs">{escrow.contractId}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                       <Badge variant="outline">
                         Importer: {escrow.roles.releaseSigner.slice(0, 4)}...{escrow.roles.releaseSigner.slice(-4)}
                       </Badge>
                       <Badge variant="outline">
                         Exporter: {escrow.roles.serviceProvider.slice(0, 4)}...{escrow.roles.serviceProvider.slice(-4)}
                       </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Milestone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Evidence</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {escrow.milestones.map((milestone: any, idx: number) => {
                        const isApproved = milestone.flags?.approved;
                        const hasEvidence = !!milestone.evidence;
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">
                              {milestone.title}
                              <div className="text-xs text-muted-foreground">{milestone.amount} USDC</div>
                            </TableCell>
                            <TableCell>
                              {isApproved ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                              ) : (
                                <Badge variant="secondary">{milestone.status || "Pending"}</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {hasEvidence ? (
                                <a href={milestone.evidence} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center text-xs">
                                  Review Evidence <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground flex items-center italic">
                                  <AlertCircle className="mr-1 h-3 w-3" /> No evidence yet
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {!isApproved && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApprove(escrow.contractId, idx)}
                                  disabled={!hasEvidence || isApproving === `${escrow.contractId}-${idx}`}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  {isApproving === `${escrow.contractId}-${idx}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                  )}
                                  Approve
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-muted-foreground">No inspection requests found.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
