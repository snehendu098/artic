"use client";

import { useState } from "react";
import {
  InfoPopup,
  InfoPopupTrigger,
  InfoPopupContent,
} from "@/components/ui/info-popup";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Wallet } from "lucide-react";
import { dummyAssets, dummyWallets } from "@/constants/data";
import Header from "@/components/common/Header";

export default function ViewAllAssetsDialog() {
  const [open, setOpen] = useState(false);
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatAssetAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: amount < 1 ? 4 : 2,
    }).format(amount);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleAsset = (assetId: string) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId);
    } else {
      newExpanded.add(assetId);
    }
    setExpandedAssets(newExpanded);
  };

  const totalValue = dummyAssets.reduce(
    (sum, asset) => sum + asset.valueUSD,
    0,
  );

  return (
    <InfoPopup open={open} onOpenChange={setOpen}>
      <InfoPopupTrigger asChild>
        <button className="w-full mt-3 py-2 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 flex items-center justify-center gap-2 group">
          <span className="text-xs text-white/70 group-hover:text-primary transition-colors">
            View All
          </span>
          <ArrowRight className="w-3 h-3 text-white/70 group-hover:text-primary transition-colors" />
        </button>
      </InfoPopupTrigger>

      <InfoPopupContent>
        <div className="h-full flex flex-col items-center">
          <div className="w-full max-w-5xl flex flex-col h-full">
            {/* Header */}
            <div className="px-8 py-6 flex-shrink-0">
              <Header
                url="/assets"
                name="Assets"
                description="All the assets from different wallets"
                indexEnabled={false}
              />
            </div>

            {/* Total Value */}
            <div className="px-8 py-4 flex-shrink-0">
              <p className="text-3xl font-semibold text-primary">
                {formatCurrency(totalValue)}
              </p>
            </div>

            {/* Assets List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="px-8 pb-8 space-y-3">
                <AnimatePresence mode="popLayout">
                  {dummyAssets.map((asset, index) => {
                    const isExpanded = expandedAssets.has(asset.id);
                    const totalAmount = asset.wallets.reduce(
                      (sum, wallet) => sum + parseFloat(wallet.amount),
                      0,
                    );

                    return (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        className="border border-neutral-700 bg-neutral-800/50 overflow-hidden"
                      >
                      {/* Asset Header */}
                      <button
                        onClick={() => toggleAsset(asset.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-neutral-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-700 flex items-center justify-center font-bold text-sm text-primary">
                            {asset.symbol.slice(0, 2)}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">
                              {asset.symbol}
                            </p>
                            <p className="text-xs text-white/40">
                              {asset.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {formatAssetAmount(totalAmount)} {asset.symbol}
                            </p>
                            <p className="text-xs text-white/50">
                              {formatCurrency(asset.valueUSD)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-neutral-700/50 rounded">
                              <Wallet className="w-3 h-3 text-primary" />
                              <span className="text-xs text-white/70">
                                {asset.wallets.length}
                              </span>
                            </div>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4 text-white/50" />
                            </motion.div>
                          </div>
                        </div>
                      </button>

                      {/* Wallet Distribution */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-2 bg-neutral-900/50 border-t border-neutral-700">
                              <p className="text-xs text-white/50 mb-3">
                                Wallet Distribution
                              </p>
                              <div className="space-y-2">
                                {asset.wallets.map((wallet, idx) => {
                                  const walletInfo = dummyWallets.find(
                                    (w) => w.address === wallet.address,
                                  );
                                  return (
                                    <motion.div
                                      key={idx}
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ delay: idx * 0.05 }}
                                      className="flex items-center justify-between p-3 bg-neutral-800 border border-neutral-700"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Wallet className="w-4 h-4 text-primary" />
                                        <div>
                                          <p className="text-xs font-medium">
                                            {walletInfo?.name ||
                                              "Unknown Wallet"}
                                          </p>
                                          <p className="text-xs text-white/40">
                                            {shortenAddress(wallet.address)}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-sm font-medium">
                                        {formatAssetAmount(
                                          parseFloat(wallet.amount),
                                        )}{" "}
                                        {asset.symbol}
                                      </p>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </InfoPopupContent>
    </InfoPopup>
  );
}
