"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2, Search } from "lucide-react";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import MarketplaceRow from "@/components/marketplace/MarketplaceRow";
import MarketplaceDetailsPanel from "@/components/marketplace/MarketplaceDetailsPanel";
import Header from "@/components/common/Header";
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
  const [searchQuery, setSearchQuery] = useState("");

  const purchasedIds = new Set(purchases.map((p) => p.strategyId));

  const filteredStrategies = useMemo(() => {
    if (!searchQuery.trim()) return strategies;
    const q = searchQuery.toLowerCase();
    return strategies.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.creatorWallet?.toLowerCase().includes(q) ||
        s.protocols?.some((p) => p.toLowerCase().includes(q))
    );
  }, [strategies, searchQuery]);

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
      isPanelOpen={!!selectedStrategy}
      showHeader={false}
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
        <Header url="/app/marketplace" />
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by name, creator, or protocol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        ) : filteredStrategies.length === 0 ? (
          <div className="text-center py-12 text-sm text-white/50">
            {searchQuery ? "No strategies match your search" : "No strategies available in the marketplace"}
          </div>
        ) : (
          filteredStrategies.map((strategy) => (
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
