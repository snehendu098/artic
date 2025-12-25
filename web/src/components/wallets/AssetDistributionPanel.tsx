"use client";

import CardLayout from "@/components/layouts/card-layout";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { ProgressiveWallet } from "@/types";

interface AssetDistributionPanelProps {
  selectedWallet: ProgressiveWallet;
  onClose: () => void;
  formatCurrency: (value: number) => string;
  formatAssetAmount: (value: number) => string;
}

const AssetDistributionPanel = ({
  selectedWallet,
  onClose,
  formatCurrency,
  formatAssetAmount,
}: AssetDistributionPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-[40%] mt-[52px]"
    >
      <CardLayout>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-white/50">// asset distribution</p>
            <p className="uppercase">{selectedWallet.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group"
          >
            <X className="w-4 h-4 group-hover:text-primary transition-colors" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {selectedWallet.loadingState === "initial" ? (
            [1, 2].map((i) => (
              <div
                key={i}
                className="p-3 bg-neutral-800 border border-neutral-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-700 animate-pulse" />
                    <div>
                      <div className="h-4 w-12 bg-neutral-700 animate-pulse rounded" />
                      <div className="h-3 w-16 bg-neutral-700 animate-pulse rounded mt-1" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-16 bg-neutral-700 animate-pulse rounded" />
                    <div className="h-3 w-12 bg-neutral-700 animate-pulse rounded mt-1" />
                  </div>
                </div>
              </div>
            ))
          ) : (selectedWallet.assets ?? []).length > 0 ? (
            (selectedWallet.assets ?? []).map((asset, index) => (
              <motion.div
                key={`${asset.id}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="p-3 bg-neutral-800 border border-neutral-700 hover:border-primary/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-700 flex items-center justify-center font-bold text-xs text-primary">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{asset.symbol}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {asset.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatAssetAmount(asset.value)} {asset.symbol}
                    </p>
                    {selectedWallet.loadingState === "complete" ? (
                      <p className="text-xs text-primary mt-0.5">
                        {formatCurrency(asset.valueUSD)}
                      </p>
                    ) : (
                      <div className="h-3 w-12 bg-neutral-700 animate-pulse rounded mt-1" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-3 bg-neutral-800 border border-neutral-700 text-center">
              <p className="text-sm text-white/40">No assets</p>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-neutral-800/50 border border-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Total Value</span>
            {selectedWallet.loadingState === "complete" ? (
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(selectedWallet.balanceUSD ?? 0)}
              </span>
            ) : (
              <div className="h-4 w-16 bg-neutral-700 animate-pulse rounded" />
            )}
          </div>
        </div>
      </CardLayout>
    </motion.div>
  );
};

export default AssetDistributionPanel;
