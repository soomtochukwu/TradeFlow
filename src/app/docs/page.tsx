"use client";

import Link from "next/link";
import { Ship, ArrowLeft, Code2, ShieldCheck, Database, Cpu, Layers, Globe, Gavel } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function TechnicalOverview() {
  return (
    <div className="min-h-screen bg-[#050508] text-foreground selection:bg-primary/30 font-sans pb-20">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="h-20 flex items-center px-6 md:px-12 border-b border-white/5 glass-dark sticky top-0 z-50">
        <Link href="/" className="flex items-center group">
          <ArrowLeft className="mr-4 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <Image src="/logo.svg" alt="TradeFlow Logo" width={28} height={28} className="mr-3" />
          <span className="font-black text-xl tracking-tighter uppercase italic">Technical Docs</span>
        </Link>
      </header>

      <main className="container max-w-4xl px-6 mx-auto pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <section>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6">
              Protocol <span className="text-gradient">Architecture</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              TradeFlow is an enterprise-grade middleware built on top of the Stellar network, utilizing the Trustless Work protocol to digitize high-value trade finance instruments.
            </p>
          </section>

          {/* Core Tech Stack */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechCard 
              icon={Cpu}
              title="Stellar / Soroban"
              description="The foundational layer for transaction finality (< 5s) and low-cost execution. All business logic is enforced by WASM-based smart contracts."
            />
            <TechCard 
              icon={Layers}
              title="Trustless Work SDK"
              description="Utilizes the Multi-Release primitive to handle phased risk mitigation. Capital is locked on-chain and released only via cryptographic signatures."
            />
            <TechCard 
              icon={Database}
              title="IPFS (Pinata)"
              description="Decentralized storage for non-fungible evidence. Bills of Lading and Warehouse Receipts are pinned to IPFS and linked to the contract state via CIDs."
            />
            <TechCard 
              icon={Code2}
              title="Next.js 14"
              description="A high-performance frontend framework using React Query for optimistic data syncing and Framer Motion for immersive UX."
            />
          </section>

          {/* The Lifecycle */}
          <section className="space-y-8 pt-12">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-6">The Escrow Lifecycle</h2>
            <div className="space-y-8 relative">
              <LifecycleItem 
                step="1"
                title="Contract Initiation"
                details="The Importer deploys a Multi-Release Escrow contract. They define the Service Provider (Exporter), the Approver (Inspector), and the Dispute Resolver (Arbitrator)."
              />
              <LifecycleItem 
                step="2"
                title="Capital Funding"
                details="Capital (USDC) is transferred from the Importer's wallet to the smart contract. The agreement is now frozen and globally verifiable."
              />
              <LifecycleItem 
                step="3"
                title="Milestone Execution"
                details="The Exporter hits production/logistics milestones. For each, they submit a status update and a CID pointing to their proof of work on IPFS."
              />
              <LifecycleItem 
                step="4"
                title="Cryptographic Approval"
                details="The Inspector verifies the physical goods and digital documents. Their signature on-chain triggers the smart contract to release specific milestone funds."
              />
            </div>
          </section>

          {/* Security & Roles */}
          <section className="space-y-8 pt-12">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-6">Roles & RBAC</h2>
             <p className="text-muted-foreground font-medium">
               TradeFlow uses strict Role-Based Access Control (RBAC) at the smart contract level. Only the addresses defined during initiation have authority to move funds or update states.
             </p>
             <div className="p-8 rounded-2xl glass border-white/5 space-y-4">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <span className="font-bold uppercase tracking-widest text-xs text-primary">Principle of Least Privilege</span>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      The Platform (TradeFlow) never has custody of user funds. We only facilitate the creation of the unsigned XDRs (Stellar transactions) that the users must sign with their private keys via specialized wallet modules (Freighter, Albedo).
                    </p>
                  </div>
                </div>
             </div>
          </section>

          {/* Dispute Mechanism */}
          <section className="space-y-8 pt-12">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-6">Dispute Resolution</h2>
             <p className="text-muted-foreground font-medium">
               Trade Finance is complex. When verification fails, the 'Halt' mechanism allows any party to freeze the agreement.
             </p>
             <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-6">
                <Gavel className="h-12 w-12 text-red-500 opacity-50 shrink-0" />
                <p className="text-sm italic">
                  "The Arbitrator acts as an on-chain judge. They can manually distribute the locked USDC between the parties based on a legal review of the IPFS evidence logs."
                </p>
             </div>
          </section>

          {/* CTA Footer */}
          <footer className="pt-20 text-center">
             <div className="h-[1px] w-full bg-white/5 mb-12" />
             <Link href="/">
               <Button className="glow-primary rounded-full px-12 h-14 font-black uppercase italic tracking-tighter text-lg">
                 Back to Main Site
               </Button>
             </Link>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}

function TechCard({ icon: Icon, title, description }: any) {
  return (
    <div className="p-6 rounded-2xl glass border-white/5 hover:border-primary/20 transition-all group">
      <Icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
      <h3 className="font-black uppercase italic tracking-tighter text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function LifecycleItem({ step, title, details }: any) {
  return (
    <div className="relative pl-16 pb-4">
      <div className="absolute left-0 top-0 h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center font-black italic text-primary bg-[#050508] z-10">
        {step}
      </div>
      <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{details}</p>
    </div>
  );
}
