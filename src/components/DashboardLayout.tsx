"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/providers/WalletProvider";
import { Ship, LayoutDashboard, Settings, LogOut, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { address, connect, disconnect } = useWallet();
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: pathname.split('/').slice(0, 2).join('/') || "/", icon: LayoutDashboard },
    { label: "Settings", href: "#", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#050508] text-foreground selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl hidden md:flex flex-col z-50">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="/" className="flex items-center">
            <Ship className="h-6 w-6 mr-3 text-primary" />
            <span className="font-black text-lg tracking-tighter uppercase italic">TradeFlow</span>
          </Link>
        </div>
        <nav className="flex-1 p-6 space-y-4">
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4 px-2">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-bold tracking-tight rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 mr-3 transition-colors ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-3 w-3" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-white/5">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold tracking-tight rounded-xl" 
            onClick={disconnect}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Disconnect
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-12 z-40">
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
             <h1 className="text-xl font-black uppercase tracking-tighter italic">
              {pathname.split('/')[1]} Console
            </h1>
          </div>
          <div className="flex items-center gap-6">
            {address ? (
              <div className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 px-4 py-2 rounded-full text-muted-foreground tracking-widest">
                {address.slice(0, 8)}...{address.slice(-6)}
              </div>
            ) : (
              <Button onClick={connect} className="glow-primary rounded-full px-8 h-10 font-bold" size="sm">
                Connect Wallet
              </Button>
            )}
          </div>
        </header>
        
        <main className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>

        {/* Decorative Background Element */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 pointer-events-none" />
      </div>
    </div>
  );
}
