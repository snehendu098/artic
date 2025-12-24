"use client";

import { Wallet, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Wallet as WalletType } from "@/types";

interface WalletRowProps {
  wallet: WalletType;
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
            <p className="text-xs text-white/40">{shortenAddress(wallet.address)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          <motion.div
            animate={{
              x: isHovered ? -60 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-right"
          >
            <p className="text-sm font-semibold">
              {formatCurrency(wallet.balanceUSD)}
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              {wallet.balance.toFixed(2)} ETH
            </p>
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
            <span className="text-xs text-white font-medium">
              {wallet.assets.length}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletRow;
