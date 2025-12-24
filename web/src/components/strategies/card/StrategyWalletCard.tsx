"use client";

import CardLayout from "@/components/layouts/card-layout";
import { Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Wallet as WalletType } from "@/types";

interface StrategyWalletCardProps {
  wallet: WalletType | null;
  selectedWallet: string | null;
  onWalletClick: () => void;
  formatCurrency: (value: number) => string;
  formatAssetAmount: (value: number) => string;
  shortenAddress: (address: string) => string;
}

const StrategyWalletCard = ({
  wallet,
  selectedWallet,
  onWalletClick,
  formatCurrency,
  formatAssetAmount,
  shortenAddress,
}: StrategyWalletCardProps) => {
  if (!wallet) return null;

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">// delegated wallet</p>
        <p className="uppercase mb-3">Wallet</p>
      </div>
      <div
        onClick={onWalletClick}
        className="p-3 bg-neutral-800 border border-neutral-700 hover:border-primary/50 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-700">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{wallet.name}</p>
              <p className="text-xs text-white/40 mt-0.5">
                {shortenAddress(wallet.address)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">
              {formatCurrency(wallet.balanceUSD)}
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              {wallet.assets.length} assets
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 space-y-1.5 overflow-hidden"
        >
          <p className="text-xs text-white/50 px-1 mt-2">Assets</p>
          {wallet.assets.map((asset) => (
            <div
              key={asset.id}
              className="p-2.5 bg-neutral-800/50 border border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-neutral-700 flex items-center justify-center text-xs font-bold text-primary">
                    {asset.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{asset.symbol}</p>
                    <p className="text-xs text-white/40">{asset.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatAssetAmount(asset.value)} {asset.symbol}
                  </p>
                  <p className="text-xs text-primary">
                    {formatCurrency(asset.valueUSD)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </CardLayout>
  );
};

export default StrategyWalletCard;
