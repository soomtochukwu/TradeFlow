"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useWallet } from "@/providers/WalletProvider";
import { ShieldCheck, Landmark, ArrowRight, Globe, Zap, Lock, Ship, Gavel } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";

export default function LandingPage() {
  const { address, connect } = useWallet();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 bg-[#050508]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 h-20 flex items-center px-6 md:px-12 glass-dark">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="TradeFlow Logo" width={32} height={32} className="mr-3" />
          <span className="font-black text-2xl tracking-tighter uppercase italic">TradeFlow</span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          {address ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-muted-foreground hidden md:inline-block">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <Link href="/importer">
                <Button className="glow-primary hover:scale-105 transition-transform" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <Button onClick={connect} className="glow-primary rounded-full px-8" size="sm">
              Connect Wallet
            </Button>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div style={{ y, opacity }} className="container px-4 md:px-6 z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/50 text-primary uppercase tracking-[0.2em] text-[10px] font-bold">
                Next-Gen Trade Finance
              </Badge>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                SECURE GLOBAL <br />
                <span className="text-gradient">COMMERCE</span>
              </h1>
              <p className="mx-auto max-w-[600px] text-muted-foreground text-lg md:text-xl mb-12 font-medium">
                Bridge the trust gap with digital Letters of Credit powered by Stellar's trustless escrow primitives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button render={<Link href={address ? "/importer" : "#"} />} size="lg" className="h-14 px-10 rounded-full glow-primary text-lg font-bold">
                  Launch App <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full border-white/10 hover:bg-white/5 text-lg font-bold backdrop-blur-sm">
                  Whitepaper
                </Button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Animated Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
        </section>

        {/* Stats Section */}
        <section className="py-24 border-y border-white/5 glass">
          <div className="container px-4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Finality", value: "< 5s", icon: Zap },
              { label: "Fees", value: "< $0.01", icon: Globe },
              { label: "Asset", value: "USDC", icon: ShieldCheck },
              { label: "Security", value: "Non-Custodial", icon: Lock },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-5 w-5 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-32 relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase text-gradient">The Ecosystem</h2>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Four Pillars of Synchronized Trade</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  role: "Importer",
                  desc: "Secure your purchase. Deposit funds into escrow and only release them upon verification.",
                  icon: Landmark,
                  color: "text-blue-400",
                  href: "/importer"
                },
                {
                  role: "Exporter",
                  desc: "Guarantee your payment. Show proof of work and shipment to unlock phased milestones.",
                  icon: Ship,
                  color: "text-green-400",
                  href: "/exporter"
                },
                {
                  role: "Inspector",
                  desc: "The trust bridge. Verify documents and physical goods to approve on-chain payouts.",
                  icon: ShieldCheck,
                  color: "text-purple-400",
                  href: "/inspector"
                },
                {
                  role: "Arbitrator",
                  desc: "Legal resolution. Review contested agreements and distribute capital based on judgment.",
                  icon: Gavel,
                  color: "text-red-400",
                  href: "/arbitrator"
                }
              ].map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Card className="glass h-full hover:border-primary/50 transition-all group overflow-hidden border-white/5">
                    <CardHeader className="p-6">
                      <role.icon className={`h-10 w-10 mb-4 ${role.color} group-hover:scale-110 transition-transform`} />
                      <CardTitle className="text-xl font-black uppercase italic tracking-tighter">{role.role}</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs font-medium leading-relaxed mt-2">
                        {role.desc}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <Button render={<Link href={role.href} />} variant="link" className="px-0 text-primary font-bold uppercase tracking-tighter text-xs">
                        Enter Console <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/5 glass-dark">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center">
            <Image src="/logo.svg" alt="TradeFlow Logo" width={24} height={24} className="mr-2 opacity-80" />
            <span className="font-bold text-lg tracking-tighter uppercase italic text-muted-foreground">TradeFlow</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            © 2026 TradeFlow // Engineered for Boundless
          </p>
          <div className="flex gap-6">
            <Link className="text-[10px] uppercase tracking-widest font-bold hover:text-primary transition-colors" href="#">Twitter</Link>
            <Link className="text-[10px] uppercase tracking-widest font-bold hover:text-primary transition-colors" href="#">Github</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className, variant = "default" }: any) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
