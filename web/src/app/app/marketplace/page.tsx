"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import MarketplaceRow from "@/components/marketplace/MarketplaceRow";
import MarketplaceDetailsPanel from "@/components/marketplace/MarketplaceDetailsPanel";
import {
  getMarketplaceStrategies,
  type MarketplaceStrategy,
} from "@/actions/marketplace.actions";
import { usePurchases } from "@/hooks";

const MarketplacePage = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: purchases, refetch: refetchPurchases } =
    usePurchases(walletAddress);

  const [strategies, setStrategies] = useState<MarketplaceStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] =
    useState<MarketplaceStrategy | null>(null);

  const purchasedIds = new Set(purchases.map((p) => p.strategyId));

  const fetchStrategies = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMarketplaceStrategies();
      setStrategies(data);
    } catch (error) {
      console.error("Failed to fetch marketplace:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const handlePurchaseComplete = () => {
    refetchPurchases();
    setSelectedStrategy(null);
  };

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Marketplace"
      subtitle="// browse strategies"
      isPanelOpen={!!selectedStrategy}
      sidePanel={
        selectedStrategy && (
          <MarketplaceDetailsPanel
            strategy={selectedStrategy}
            onClose={() => setSelectedStrategy(null)}
            isPurchased={purchasedIds.has(selectedStrategy.id)}
            userWallet={walletAddress}
            onPurchaseComplete={handlePurchaseComplete}
          />
        )
      }
    >
      <div className="w-full space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        ) : strategies.length === 0 ? (
          <div className="text-center py-12 text-sm text-white/50">
            No strategies available in the marketplace
          </div>
        ) : (
          strategies.map((strategy) => (
            <MarketplaceRow
              key={strategy.id}
              strategy={strategy}
              onClick={() => setSelectedStrategy(strategy)}
              isSelected={selectedStrategy?.id === strategy.id}
              isPurchased={purchasedIds.has(strategy.id)}
            />
          ))
        )}
      </div>
    </SplitPanelLayout>
  );
};

export default MarketplacePage;
