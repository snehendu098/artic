"use client";

import { TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { MarketplaceStrategy } from "@/actions/marketplace.actions";

interface MarketplaceRowProps {
  strategy: MarketplaceStrategy;
  onClick: () => void;
  isSelected: boolean;
  isPurchased: boolean;
}

function truncateWallet(wallet: string): string {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

const MarketplaceRow = ({
  strategy,
  onClick,
  isSelected,
  isPurchased,
}: MarketplaceRowProps) => {
  const creatorDisplay =
    strategy.creatorUsername || truncateWallet(strategy.creatorWallet);

  return (
    <motion.div
      onClick={onClick}
      className={`p-3 bg-neutral-900 border transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? "border-primary/50"
          : "border-neutral-700 hover:border-neutral-600"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-neutral-700 shrink-0">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">{strategy.name}</p>
              {isPurchased && (
                <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary shrink-0">
                  Purchased
                </span>
              )}
            </div>
            <p className="text-xs text-white/40 mt-0.5">by {creatorDisplay}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {strategy.protocols.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {strategy.protocols.slice(0, 2).map((p) => (
                <span
                  key={p}
                  className="text-[10px] px-1.5 py-0.5 bg-neutral-700 text-white/60"
                >
                  {p}
                </span>
              ))}
              {strategy.protocols.length > 2 && (
                <span className="text-[10px] text-white/40">
                  +{strategy.protocols.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-white/50" />
            <span className="text-xs text-white/50">
              {strategy.subscriberCount}
            </span>
          </div>

          <div className="text-right min-w-[60px]">
            <p className="text-xs text-primary font-medium">
              {strategy.priceMnt
                ? `${parseFloat(strategy.priceMnt).toFixed(4)} MNT`
                : "Free"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketplaceRow;
