import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { TrustlessWorkProvider } from "@/providers/TrustlessWorkProvider";
import { WalletProvider } from "@/providers/WalletProvider";
import { Toaster } from "sonner";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TradeFlow | On-Chain Trade Finance",
    template: "%s | TradeFlow"
  },
  description: "Secure global commerce with digital Letters of Credit. Non-custodial, milestone-based escrow powered by Trustless Work on Stellar.",
  metadataBase: new URL("https://tradeflow.finance"), // Replace with actual URL if known
  openGraph: {
    title: "TradeFlow | On-Chain Trade Finance",
    description: "Digital Letter of Credit using Trustless Work on Stellar. Bridging the trust gap in international trade.",
    url: "https://tradeflow.finance",
    siteName: "TradeFlow",
    images: [
      {
        url: "/banner.svg",
        width: 1200,
        height: 630,
        alt: "TradeFlow - Secure Global Commerce",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeFlow | On-Chain Trade Finance",
    description: "Secure global commerce with digital Letters of Credit on Stellar.",
    images: ["/banner.svg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TrustlessWorkProvider>
            <WalletProvider>
              {children}
              <Toaster richColors position="top-right" />
            </WalletProvider>
          </TrustlessWorkProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
