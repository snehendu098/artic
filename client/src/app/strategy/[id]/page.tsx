"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { fetchStrategyDetails, StrategyPageData } from "@/lib/actions";
import { ChevronLeft, AlertCircle } from "lucide-react";
import StrategyContentCard from "@/components/cards/strategy/StrategyContentCard";
import WalletPortfolioCard from "@/components/cards/strategy/WalletPortfolioCard";
import AssetsInWalletCard from "@/components/cards/strategy/AssetsInWalletCard";
import ConfigurationsCard from "@/components/cards/strategy/ConfigurationsCard";
import DelegationWalletCard from "@/components/cards/strategy/DelegationWalletCard";
import WalletActionsCard from "@/components/cards/strategy/WalletActionsCard";
import SubscribersCard from "@/components/strategy/SubscriberCard";

export default function StrategyPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = usePrivy();
  const strategyId = params.id as string;

  const [strategyData, setStrategyData] = useState<StrategyPageData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white">Strategy Name</h1>
        <p className="text-white/40 mt-2">Strategy Details & Performance</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="w-full grid grid-cols-6 gap-6">
        <div className="w-full col-span-4">
          <div className="gradient-card-subtle rounded-lg border p-4 bg-card">
            hi
          </div>
        </div>
        <div className="w-full col-span-2">
          <SubscribersCard />
        </div>
      </div>
    </div>
  );
}
