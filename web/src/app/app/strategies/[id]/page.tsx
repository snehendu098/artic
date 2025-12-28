"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, use, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { formatUnits } from "viem";
import StrategyInfoCard from "@/components/strategies/card/StrategyInfoCard";
import StrategyCodeCard from "@/components/strategies/card/StrategyCodeCard";
import StrategyActionsPanel from "@/components/strategies/card/StrategyActionsPanel";
import StrategySubscribersCard from "@/components/strategies/card/StrategySubscribersCard";
import StrategyWalletCard from "@/components/strategies/card/StrategyWalletCard";
import StrategyActionsCard from "@/components/strategies/card/StrategyActionsCard";
import { getStrategyDetails, activateStrategy, publishStrategy, type StrategyDetailsResponse } from "@/actions/strategy.actions";
import { getWalletAssets } from "@/lib/blockchain/assets";
import { useWallets } from "@/hooks/useWallets";
import { useMarketplace } from "@/hooks/useMarketplace";
import type { Wallet, Subscriber, Action } from "@/types";

const StrategyDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: delegationWallets, refetch: refetchWallets } = useWallets(walletAddress);
  const { listStrategy } = useMarketplace();

  const [data, setData] = useState<StrategyDetailsResponse | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const result = await getStrategyDetails(id, walletAddress);
        if (result) {
          setData(result);
          setIsPublic(result.strategy.isPublic ?? false);
          setHasSubscription(!!result.subscription);
          setSubscriptionActive(result.subscription?.isActive ?? false);

          // Fetch wallet assets if there's a subscription
          if (result.subscription?.delegationWalletAddress) {
            try {
              const chainId = 5003; // Mantle testnet
              const assets = await getWalletAssets(
                result.subscription.delegationWalletAddress as `0x${string}`,
                chainId
              );
              setWallet({
                id: result.subscription.delegationWalletId,
                name: result.subscription.delegationWalletName,
                address: result.subscription.delegationWalletAddress,
                balance: assets.totalUSD,
                balanceUSD: assets.totalUSD,
                assets: assets.assets.map((a, idx) => ({
                  id: `${a.address}-${idx}`,
                  symbol: a.symbol,
                  name: a.name,
                  value: parseFloat(formatUnits(a.balance, a.decimals)),
                  valueUSD: parseFloat(formatUnits(a.balance, a.decimals)) * a.priceUSD,
                  change24h: 0,
                })),
              });
            } catch (err) {
              console.error("Failed to fetch wallet assets:", err);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch strategy details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, walletAddress]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-white">Strategy not found</div>;
  }

  const { strategy, subscribers, recentActions } = data;

  // Map subscribers to expected format
  const strategySubscribers: Subscriber[] = subscribers;

  // Map actions to expected format
  const walletActions: Action[] = recentActions;

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

  // Compute user-specific status based on subscription
  const getUserStatus = (): "active" | "paused" | "draft" | "not_activated" => {
    if (data?.isCreator && !hasSubscription) {
      return strategy.status === "draft" ? "draft" : "not_activated";
    }
    if (!hasSubscription) {
      return "not_activated";
    }
    return subscriptionActive ? "active" : "paused";
  };

  const userStatus = getUserStatus();

  const handleToggleStatus = () => {
    // Toggle subscription active state
    if (subscriptionActive) {
      setSubscriptionActive(false);
    } else {
      setSubscriptionActive(true);
    }
    // TODO: Call API to update subscription status
  };

  const handleActivate = async (delegationWalletId: string) => {
    if (!walletAddress) return;
    const result = await activateStrategy(id, walletAddress, delegationWalletId);
    if (result.success) {
      setHasSubscription(true);
      setSubscriptionActive(true);
      // Refetch to get updated subscription data
      const updatedData = await getStrategyDetails(id, walletAddress);
      if (updatedData) {
        setData(updatedData);
      }
    }
  };

  const handlePublish = async (priceMnt?: string) => {
    if (!walletAddress) return;
    try {
      // First, list on-chain
      const price = priceMnt || "0";
      await listStrategy(id, price);

      // Then update DB
      const result = await publishStrategy(id, walletAddress, priceMnt);
      if (result.success) {
        setIsPublic(true);
        // Refetch to get updated strategy data
        const updatedData = await getStrategyDetails(id, walletAddress);
        if (updatedData) {
          setData(updatedData);
        }
      }
    } catch (error) {
      console.error("Failed to publish strategy:", error);
    }
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
            userStatus={userStatus}
            isActive={subscriptionActive}
            onToggleStatus={handleToggleStatus}
            showToggle={hasSubscription}
          />

          {data.isCreator && strategy.strategyCode && (
            <StrategyCodeCard code={strategy.strategyCode} />
          )}

          {((data.isCreator && !isPublic) || ((data.isCreator || data.isPurchased) && !data.subscription)) && (
            <StrategyActionsPanel
              strategy={{ ...strategy, isPublic }}
              isCreator={data.isCreator}
              wallets={delegationWallets}
              onActivate={handleActivate}
              onPublish={handlePublish}
              onWalletCreated={refetchWallets}
              hasSubscription={hasSubscription}
            />
          )}

          <StrategySubscribersCard
            subscribers={strategySubscribers}
            isCreator={data.isCreator}
            currentUserWallet={walletAddress}
          />

          <StrategyWalletCard
            wallet={wallet}
            selectedWallet={selectedWallet}
            onWalletClick={() =>
              setSelectedWallet(selectedWallet ? null : wallet?.id || null)
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
