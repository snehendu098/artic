"use client";

import { dummyAssets, dummyWallets } from "@/constants/data";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import type { Asset } from "@/types";
import AssetRow from "@/components/assets/AssetRow";
import WalletDistributionPanel from "@/components/assets/WalletDistributionPanel";

const AssetsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

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

  const getWalletName = (address: string) => {
    const wallet = dummyWallets.find((w) => w.address === address);
    return wallet?.name || "Unknown Wallet";
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex items-start gap-4">
        <motion.div
          animate={{
            x: selectedAsset ? 0 : "33.33%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-[60%] flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <Link href="/app/dashboard">
              <button className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group">
                <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
              </button>
            </Link>
            <div>
              <p className="text-xs text-white/50">// portfolio overview</p>
              <p className="uppercase">All Assets</p>
            </div>
          </div>

          <div className="w-full space-y-2 mt-4">
            {dummyAssets.map((asset) => (
              <AssetRow
                key={asset.id}
                asset={asset}
                formatCurrency={formatCurrency}
                formatAssetAmount={formatAssetAmount}
                onClick={() => setSelectedAsset(asset)}
                isSelected={selectedAsset?.id === asset.id}
              />
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedAsset && (
            <WalletDistributionPanel
              selectedAsset={selectedAsset}
              onClose={() => setSelectedAsset(null)}
              formatCurrency={formatCurrency}
              formatAssetAmount={formatAssetAmount}
              shortenAddress={shortenAddress}
              getWalletName={getWalletName}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AssetsPage;
