"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { fetchStrategyDetails, StrategyPageData } from "@/lib/actions";
import { ChevronLeft, AlertCircle } from "lucide-react";
import StrategyContentCard from "@/components/cards/strategy/StrategyContentCard";
import SubscribersCard from "@/components/cards/strategy/SubscribersCard";
import WalletPortfolioCard from "@/components/cards/strategy/WalletPortfolioCard";
import AssetsInWalletCard from "@/components/cards/strategy/AssetsInWalletCard";
import ConfigurationsCard from "@/components/cards/strategy/ConfigurationsCard";
import DelegationWalletCard from "@/components/cards/strategy/DelegationWalletCard";
import WalletActionsCard from "@/components/cards/strategy/WalletActionsCard";

export default function StrategyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = usePrivy();
  const strategyId = params.id as string;

  const [strategyData, setStrategyData] = useState<StrategyPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const loadStrategy = async () => {
      try {
        setLoading(true);
        setError(null);

        const userWallet = user?.wallet?.address;
        const data = await fetchStrategyDetails(strategyId, userWallet);

        if (!data) {
          setError("Failed to load strategy details");
          return;
        }

        setStrategyData(data);
        setIsActive(data.strategy.isActive);
        setIsPublic(data.strategy.isPublic || false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    loadStrategy();
  }, [strategyId, user?.wallet?.address]);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border border-white/10 border-t-white/40 mx-auto mb-4"></div>
            <p className="text-white/60">Loading strategy...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !strategyData) {
    return (
      <div className="min-h-screen p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-300 font-semibold mb-1">Error</h3>
            <p className="text-red-200/70">{error || "Strategy not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white">{strategyData.strategy.name}</h1>
        <p className="text-white/40 mt-2">Strategy Details & Performance</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Row 1: Strategy Content (2 cols) + Subscribers (2 cols) */}
        <div className="lg:col-span-2">
          <StrategyContentCard content={strategyData.strategy.strategy} />
        </div>
        <div className="lg:col-span-2">
          <SubscribersCard
            subscribers={strategyData.subscribers}
            totalCount={strategyData.strategy.subscriberCount}
          />
        </div>

        {/* Row 2: Wallet Portfolio (4 cols full width) */}
        <div className="lg:col-span-4">
          <WalletPortfolioCard />
        </div>

        {/* Row 3: Assets in Wallet (4 cols full width) */}
        <div className="lg:col-span-4">
          <AssetsInWalletCard />
        </div>

        {/* Row 4: Configurations (2 cols) + Delegation Wallet (2 cols) */}
        <div className="lg:col-span-2">
          <ConfigurationsCard
            isActive={isActive}
            isPublic={isPublic}
            onActiveChange={setIsActive}
            onPublicChange={setIsPublic}
          />
        </div>
        <div className="lg:col-span-2">
          <DelegationWalletCard
            wallet={strategyData.delegationWallet}
            isActive={strategyData.isActiveForUser}
          />
        </div>

        {/* Row 5: Wallet Actions (4 cols full width) */}
        <div className="lg:col-span-4">
          <WalletActionsCard actions={strategyData.walletActions} />
        </div>
      </div>
    </div>
  );
}
