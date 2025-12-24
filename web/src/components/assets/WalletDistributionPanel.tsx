"use client";

import CardLayout from "@/components/layouts/card-layout";
import { Wallet, X } from "lucide-react";
import { motion } from "framer-motion";
import type { Asset } from "@/types";

interface WalletDistributionPanelProps {
  selectedAsset: Asset;
  onClose: () => void;
  formatCurrency: (value: number) => string;
  formatAssetAmount: (value: number) => string;
  shortenAddress: (address: string) => string;
  getWalletName: (address: string) => string;
}

const WalletDistributionPanel = ({
  selectedAsset,
  onClose,
  formatCurrency,
  formatAssetAmount,
  shortenAddress,
  getWalletName,
}: WalletDistributionPanelProps) => {
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
            <p className="text-xs text-white/50">// wallet distribution</p>
            <p className="uppercase">{selectedAsset.symbol} Distribution</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group"
          >
            <X className="w-4 h-4 group-hover:text-primary transition-colors" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {selectedAsset.wallets.map((wallet, index) => {
            const walletName = getWalletName(wallet.address);
            const amount = parseFloat(wallet.amount);
            const valueUSD =
              (amount /
                selectedAsset.wallets.reduce(
                  (sum, w) => sum + parseFloat(w.amount),
                  0,
                )) *
              selectedAsset.valueUSD;

            return (
              <motion.div
                key={`${wallet.address}-${index}`}
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
                    <div className="p-2 bg-neutral-700">
                      <Wallet className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{walletName}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {shortenAddress(wallet.address)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatAssetAmount(amount)} {selectedAsset.symbol}
                    </p>
                    <p className="text-xs text-primary mt-0.5">
                      {formatCurrency(valueUSD)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-neutral-800/50 border border-neutral-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Total Amount</span>
              <span className="text-sm font-semibold">
                {formatAssetAmount(
                  selectedAsset.wallets.reduce(
                    (sum, w) => sum + parseFloat(w.amount),
                    0,
                  ),
                )}{" "}
                {selectedAsset.symbol}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Total Value</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(selectedAsset.valueUSD)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Wallets</span>
              <span className="text-sm font-semibold">
                {selectedAsset.wallets.length}
              </span>
            </div>
          </div>
        </div>
      </CardLayout>
    </motion.div>
  );
};

export default WalletDistributionPanel;
