"use client";

import CardLayout from "@/components/layouts/card-layout";
import { X, Users, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMarketplace } from "@/hooks/useMarketplace";
import { createPurchase } from "@/actions/marketplace.actions";
import type { MarketplaceStrategy } from "@/actions/marketplace.actions";

interface MarketplaceDetailsPanelProps {
  strategy: MarketplaceStrategy;
  onClose: () => void;
  isPurchased: boolean;
  userWallet: string | undefined;
  onPurchaseComplete: () => void;
}

function truncateWallet(wallet: string): string {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

const MarketplaceDetailsPanel = ({
  strategy,
  onClose,
  isPurchased,
  userWallet,
  onPurchaseComplete,
}: MarketplaceDetailsPanelProps) => {
  const router = useRouter();
  const { purchaseStrategy, txState, resetTxState } = useMarketplace();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const creatorDisplay =
    strategy.creatorUsername || truncateWallet(strategy.creatorWallet);

  const handleBuy = async () => {
    if (!userWallet || !strategy.priceMnt) return;

    setIsPurchasing(true);
    setPurchaseError(null);

    try {
      const txHash = await purchaseStrategy(strategy.id, strategy.priceMnt);

      if (txHash) {
        const result = await createPurchase(
          userWallet,
          strategy.id,
          strategy.priceMnt,
          txHash,
        );

        if (result.success) {
          onPurchaseComplete();
          router.push(`/app/strategies/${strategy.id}`);
        } else {
          setPurchaseError(result.message);
        }
      }
    } catch (error) {
      setPurchaseError(
        error instanceof Error ? error.message : "Purchase failed",
      );
    } finally {
      setIsPurchasing(false);
      resetTxState();
    }
  };

  const isOwner =
    userWallet?.toLowerCase() === strategy.creatorWallet.toLowerCase();
  const isFree = !strategy.priceMnt || strategy.priceMnt === "0";
  const canBuy = !isPurchased && !isOwner && userWallet && !isFree;

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
            <p className="text-xs text-white/50">// strategy details</p>
            <p className="uppercase">{strategy.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group"
          >
            <X className="w-4 h-4 group-hover:text-primary transition-colors" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Creator</p>
            <p className="text-sm text-white/90">{creatorDisplay}</p>
            {strategy.creatorUsername && (
              <p className="text-xs text-white/40 mt-1 font-mono">
                {truncateWallet(strategy.creatorWallet)}
              </p>
            )}
          </div>

          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Price</p>
            <p className="text-lg text-primary font-medium">
              {isFree
                ? "Free"
                : `${parseFloat(strategy.priceMnt!).toFixed(4)} MNT`}
            </p>
          </div>

          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Subscribers</p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-white/50" />
              <p className="text-sm text-white/90">
                {strategy.subscriberCount}
              </p>
            </div>
          </div>

          {strategy.protocols.length > 0 && (
            <div className="p-3 bg-neutral-800 border border-neutral-700">
              <p className="text-xs text-white/50 mb-2">Protocols</p>
              <div className="flex flex-wrap gap-1.5">
                {strategy.protocols.map((p) => (
                  <span
                    key={p}
                    className="text-xs px-2 py-1 bg-neutral-700 text-white/70"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {isPurchased && (
            <div className="p-3 bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                <p className="text-sm text-primary">Already Purchased</p>
              </div>
            </div>
          )}

          {isOwner && (
            <div className="p-3 bg-neutral-800 border border-neutral-700">
              <p className="text-xs text-white/50">
                You are the creator of this strategy
              </p>
            </div>
          )}

          {purchaseError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30">
              <p className="text-xs text-red-400">{purchaseError}</p>
            </div>
          )}

          {canBuy && (
            <button
              onClick={handleBuy}
              disabled={isPurchasing || txState.status === "pending"}
              className="w-full p-3 bg-primary text-black font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPurchasing || txState.status === "pending" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  Buy for {parseFloat(strategy.priceMnt!).toFixed(4)} MNT
                </span>
              )}
            </button>
          )}

          {isFree && !isPurchased && !isOwner && (
            <div className="p-3 bg-neutral-800 border border-neutral-700">
              <p className="text-xs text-white/50">
                Free strategies cannot be purchased
              </p>
            </div>
          )}
        </div>
      </CardLayout>
    </motion.div>
  );
};

export default MarketplaceDetailsPanel;
