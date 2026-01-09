"use client";

import { Wallet, Coins, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { ProgressiveWallet } from "@/types";
import ViewPrivateKeyDialog from "@/components/dialog/ViewPrivateKeyDialog";

interface WalletRowProps {
  wallet: ProgressiveWallet;
  formatCurrency: (value: number) => string;
  shortenAddress: (address: string) => string;
  onClick: () => void;
  isSelected: boolean;
}

const WalletRow = ({
  wallet,
  formatCurrency,
  shortenAddress,
  onClick,
  isSelected,
}: WalletRowProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`p-3 bg-neutral-900 border transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? "border-primary/50"
          : "border-neutral-700 hover:border-neutral-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-700">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{wallet.name}</p>
            <div className="flex items-center gap-1.5">
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
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <motion.div
              animate={{
                x: isHovered ? -60 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-center gap-3"
            >
              <ViewPrivateKeyDialog
                delegationId={wallet.id}
                walletName={wallet.name}
              />
              <div className="text-right">
                {wallet.loadingState === "initial" ? (
                  <>
                    <div className="h-4 w-16 bg-neutral-700 animate-pulse rounded" />
                    <div className="h-3 w-12 bg-neutral-700 animate-pulse rounded mt-1" />
                  </>
                ) : wallet.loadingState === "balances" ? (
                  <>
                    <div className="h-4 w-16 bg-neutral-700 animate-pulse rounded" />
                    <p className="text-xs text-white/50 mt-0.5">
                      {(wallet.balance ?? 0).toFixed(2)} MNT
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold">
                      {formatCurrency(wallet.balanceUSD ?? 0)}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">
                      {(wallet.balance ?? 0).toFixed(2)} MNT
                    </p>
                  </>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : 20,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex items-center gap-1.5 absolute right-0 bg-neutral-700/80 px-2 py-1"
            >
              <Coins className="w-3.5 h-3.5 text-white" />
              {wallet.loadingState === "initial" ? (
                <div className="h-3 w-4 bg-neutral-600 animate-pulse rounded" />
              ) : (
                <span className="text-xs text-white font-medium">
                  {wallet.assets?.length ?? 0}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletRow;
