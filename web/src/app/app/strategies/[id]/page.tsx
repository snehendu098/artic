"use client";

import {
  dummyStrategies,
  dummySubscriptions,
  dummyWallets,
  dummyActions,
  dummySubscribers,
} from "@/constants/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";
import StrategyInfoCard from "@/components/strategies/card/StrategyInfoCard";
import StrategySubscribersCard from "@/components/strategies/card/StrategySubscribersCard";
import StrategyWalletCard from "@/components/strategies/card/StrategyWalletCard";
import StrategyActionsCard from "@/components/strategies/card/StrategyActionsCard";

const StrategyDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const strategy = dummyStrategies.find((s) => s.id === id);

  const subscription = dummySubscriptions.find((s) =>
    s.strategyName.toLowerCase().includes(strategy?.name.toLowerCase() || ""),
  );

  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(strategy?.status === "active");

  if (!strategy) {
    return <div className="p-8 text-white">Strategy not found</div>;
  }

  // Get subscribers for this strategy
  const strategySubscribers = dummySubscribers.filter(
    (sub) => sub.strategyId === strategy.id,
  );

  const delegatedWallet = subscription
    ? dummyWallets.find((w) => w.id === subscription.walletId)
    : null;

  // Get actions related to this wallet
  const walletActions = delegatedWallet
    ? dummyActions
        .filter((action) =>
          action.description
            .toLowerCase()
            .includes(delegatedWallet.name.toLowerCase()),
        )
        .slice(0, 5)
    : [];

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleToggleStatus = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="w-full h-full">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/app/strategies">
            <button className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group">
              <ArrowLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
            </button>
          </Link>
          <div>
            <p className="text-xs text-white/50">// strategy details</p>
            <p className="uppercase">{strategy.name}</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-2">
          <StrategyInfoCard
            strategy={strategy}
            isActive={isActive}
            onToggleStatus={handleToggleStatus}
          />

          <StrategySubscribersCard
            subscribers={strategySubscribers}
            formatCurrency={formatCurrency}
          />

          <StrategyWalletCard
            wallet={delegatedWallet || null}
            selectedWallet={selectedWallet}
            onWalletClick={() =>
              setSelectedWallet(selectedWallet ? null : delegatedWallet?.id || null)
            }
            formatCurrency={formatCurrency}
            formatAssetAmount={formatAssetAmount}
            shortenAddress={shortenAddress}
          />

          <StrategyActionsCard
            actions={walletActions}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

export default StrategyDetailPage;
