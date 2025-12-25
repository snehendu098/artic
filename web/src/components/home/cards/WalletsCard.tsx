"use client";

import CardLayout from "@/components/layouts/card-layout";
import { Wallet, ArrowRight, Copy, Check } from "lucide-react";
import CreateWalletDialog from "@/components/dialog/CreateWalletDialog";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallets } from "@/hooks";
import type { DelegationWallet } from "@/types";

interface WalletsCardProps {
  walletAddress?: string;
}

const WalletsCardSkeleton = () => (
  <CardLayout>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-white/50">// wallets</p>
        <p className="uppercase">Wallets</p>
      </div>
      <div className="w-8 h-8 bg-neutral-700 animate-pulse" />
    </div>
    <div className="w-full space-y-3 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-neutral-700 animate-pulse" />
              <div>
                <div className="h-4 bg-neutral-700 animate-pulse w-24 mb-1" />
                <div className="h-3 bg-neutral-700 animate-pulse w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardLayout>
);

const WalletItem = ({ wallet }: { wallet: DelegationWallet }) => {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-3 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-200 group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-neutral-700 group-hover:bg-neutral-600 transition-colors">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{wallet.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-white/40">
                {shortenAddress(wallet.address)}
              </p>
              <motion.button
                onClick={handleCopy}
                className="p-0.5 hover:bg-neutral-700 rounded transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check className="w-3 h-3 text-green-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Copy className="w-3 h-3 text-white/40 hover:text-white/70 transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WalletsCard = ({ walletAddress }: WalletsCardProps) => {
  const { data: wallets, isLoading, refetch } = useWallets(walletAddress);

  if (isLoading) return <WalletsCardSkeleton />;

  const hasData = wallets && wallets.length > 0;
  const maxDisplay = 3;
  const hasMore = hasData && wallets.length > maxDisplay;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// wallets</p>
          <p className="uppercase">Wallets</p>
        </div>
        <CreateWalletDialog mode="icon" onSuccess={refetch} />
      </div>
      {hasData ? (
        <div className="w-full space-y-3 mt-4">
          {wallets.slice(0, maxDisplay).map((wallet) => (
            <WalletItem key={wallet.id} wallet={wallet} />
          ))}
        </div>
      ) : (
        <div className="mt-4 p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/40">No wallets yet</p>
          <p className="text-xs text-white/30 mt-1">Create a delegation wallet to get started</p>
        </div>
      )}
      {hasMore && (
        <Link href="/app/dashboard/wallets">
          <button className="w-full mt-3 py-2 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 flex items-center justify-center gap-2 group">
            <span className="text-xs text-white/70 group-hover:text-primary transition-colors">
              View All
            </span>
            <ArrowRight className="w-3 h-3 text-white/70 group-hover:text-primary transition-colors" />
          </button>
        </Link>
      )}
    </CardLayout>
  );
};

export default WalletsCard;
