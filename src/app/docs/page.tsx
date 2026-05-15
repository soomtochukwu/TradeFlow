"use client";

import Link from "next/link";
import { Ship, ArrowLeft, Code2, ShieldCheck, Database, Cpu, Layers, Globe, Gavel, Box, Lock } from "lucide-react";
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
              Protocol <span className="text-gradient">Integrator</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              TradeFlow is not just an application; it is a **Protocol Integrator**. We leverage enterprise-grade, pre-audited smart contract primitives to deliver institutional security without the overhead of custom contract development.
            </p>
          </section>

          {/* Infrastructure Section */}
          <section className="space-y-8 pt-6">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-6">Core Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TechCard 
                  icon={Box}
                  title="Audited Primitives"
                  description="By using the Trustless Work 'Factory' contracts, TradeFlow utilizes standardized Multi-Release logic that has been rigorously tested for security and performance."
                />
                <TechCard 
                  icon={Lock}
                  title="Non-Custodial"
                  description="Business logic is enforced by the Stellar network. TradeFlow never holds private keys or has direct custody of capital; we only facilitate user-signed XDRs."
                />
            </div>
          </section>

          {/* Core Tech Stack */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechCard 
              icon={Cpu}
              title="Stellar / Soroban"
              description="The foundational layer for transaction finality (< 5s) and low-cost execution. Business logic is executed in a WASM-based virtual machine."
            />
            <TechCard 
              icon={Layers}
              title="Trustless Work SDK"
              description="The interface layer for the Multi-Release primitive. Capital is released only upon cryptographic proof from authorized approvers."
            />
            <TechCard 
              icon={Database}
              title="IPFS (Pinata)"
              description="Decentralized storage for trade evidence. Bills of Lading and Receipts are pinned to IPFS and linked to on-chain state via CIDs."
            />
            <TechCard 
              icon={Code2}
              title="Next.js 14"
              description="Real-time on-chain data synchronization using React Query to manage the 5-second Stellar indexing latency."
            />
          </section>

          {/* The Lifecycle */}
          <section className="space-y-8 pt-12">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-6">Smart Configuration Lifecycle</h2>
            <p className="text-muted-foreground font-medium">
                Instead of coding a new contract for every trade, TradeFlow **configures** a specialized instance of the Multi-Release primitive.
            </p>
            <div className="space-y-8 relative">
              <LifecycleItem 
                step="1"
                title="Primitive Deployment"
                details="A new instance of the audited Multi-Release contract is deployed via the Trustless Work Factory. All roles (Importer, Exporter, Inspector) are cryptographically bound at this stage."
              />
              <LifecycleItem 
                step="2"
                title="Capital Funding"
                details="Funds are transferred to the non-custodial contract address. The Stellar ledger now enforces the rules of the agreement autonomously."
              />
              <LifecycleItem 
                step="3"
                title="Proof Upload"
                details="Evidence of shipment is hashed and uploaded to IPFS. The resulting CID is submitted as part of a state-update transaction to the contract."
              />
              <LifecycleItem 
                step="4"
                title="Consensus Approval"
                details="The designated Approver (Inspector) signs a transaction. The contract verifies this signature against the authorized role and releases funds to the Exporter."
              />
            </div>
          </section>

          {/* Security & Roles */}
          <section className="space-y-8 pt-12">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-6">Security Model</h2>
             <div className="p-8 rounded-2xl glass border-white/5 space-y-4">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <span className="font-bold uppercase tracking-widest text-xs text-primary">Trustless Execution</span>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-sans">
                      The core 'Law' of the trade is enforced by the Stellar Consensus Protocol. TradeFlow act as the 'Legal Clerk', drafting the paperwork (Transactions) for the parties to sign. This ensures that no single entity—including TradeFlow—can move funds without authorization.
                    </p>
                  </div>
                </div>
             </div>
          </section>

          {/* Dispute Mechanism */}
          <section className="space-y-8 pt-12">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter border-l-4 border-primary pl-6">Arbitration Layer</h2>
             <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-6">
                <Gavel className="h-12 w-12 text-red-500 opacity-50 shrink-0" />
                <p className="text-sm italic font-sans leading-relaxed">
                  "In the event of a conflict, the contract primitive allows for a 'Halt' state. A neutral Arbitrator reviews the IPFS proof logs and distributes the capital through an on-chain resolution transaction."
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
      <p className="text-sm text-muted-foreground leading-relaxed font-sans">{description}</p>
    </div>
  );
}

function LifecycleItem({ step, title, details }: any) {
  return (
    <div className="relative pl-16 pb-4">
      <div className="absolute left-0 top-0 h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center font-black italic text-primary bg-[#050508] z-10 font-sans">
        {step}
      </div>
      <h4 className="text-xl font-bold mb-2 uppercase tracking-tight italic">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed font-sans">{details}</p>
    </div>
  );
}
