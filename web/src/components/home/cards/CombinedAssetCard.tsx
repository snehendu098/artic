"use client";

import CardLayout from "@/components/layouts/card-layout";
import { dummyAssets } from "@/constants/data";
import { ArrowRight, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CombinedAssetCard = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const maxDisplay = 6;
  const hasMore = dummyAssets.length > maxDisplay;

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">// combined assets</p>
        <p className="uppercase">Assets</p>
      </div>
      <div className="w-full space-y-2 mt-4">
        {dummyAssets.slice(0, maxDisplay).map((asset) => (
          <AssetRow
            key={asset.id}
            asset={asset}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
      {hasMore && (
        <Link href="/app/dashboard/assets">
          <Button className="w-full mt-3 py-2 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 flex items-center justify-center gap-2 group">
            <span className="text-xs text-white/70 group-hover:text-primary transition-colors">
              View All
            </span>
            <ArrowRight className="w-3 h-3 text-white/70 group-hover:text-primary transition-colors" />
          </Button>
        </Link>
      )}
    </CardLayout>
  );
};

const AssetRow = ({
  asset,
  formatCurrency,
}: {
  asset: any;
  formatCurrency: (value: number) => string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate total asset amount across all wallets
  const totalAmount = asset.wallets.reduce(
    (sum: number, wallet: { amount: string }) =>
      sum + parseFloat(wallet.amount),
    0,
  );

  // Format the asset amount with appropriate decimals
  const formatAssetAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: amount < 1 ? 4 : 2,
    }).format(amount);
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="p-3 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-700 flex items-center justify-center font-bold text-xs text-primary">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium">{asset.symbol}</p>
            <p className="text-xs text-white/40">{asset.name}</p>
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
              {formatAssetAmount(totalAmount)} {asset.symbol}
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              {formatCurrency(asset.valueUSD)}
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
            <Wallet className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-white font-medium">
              {asset.wallets.length}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CombinedAssetCard;
