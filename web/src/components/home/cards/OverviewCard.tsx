"use client";

import CardLayout from "@/components/layouts/card-layout";
import { useWallets, useStrategies, useSubscribers, useAssets } from "@/hooks";

interface OverviewCardProps {
  walletAddress?: string;
  chainId: number;
}

const SubCard = ({
  heading,
  main,
  incrementor,
  isLoading,
}: {
  heading: string;
  main: string;
  incrementor?: string;
  isLoading?: boolean;
}) => (
  <div className="w-full bg-neutral-800 relative p-4 border border-neutral-700 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-neutral-750 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] cursor-pointer">
    <p className="uppercase text-xs text-white/50">{heading}</p>
    {isLoading ? (
      <div className="h-7 bg-neutral-700 animate-pulse w-16 mt-2" />
    ) : (
      <p className="text-xl mt-2 font-semibold">{main}</p>
    )}
    {incrementor && !isLoading && (
      <p
        className={`text-xs bottom-2 right-2 absolute font-medium ${
          incrementor.startsWith("+")
            ? "text-primary"
            : incrementor.startsWith("-")
              ? "text-red-400"
              : "text-white/40"
        }`}
      >
        {incrementor}
      </p>
    )}
  </div>
);

const OverviewCard = ({ walletAddress, chainId }: OverviewCardProps) => {
  const { data: wallets, isLoading: walletsLoading } = useWallets(walletAddress);
  const { data: strategies, isLoading: strategiesLoading } = useStrategies(walletAddress);
  const { data: subscribers, isLoading: subscribersLoading } = useSubscribers(walletAddress);
  const walletAddresses = wallets.map((w) => w.address);
  const { data: assets, isLoading: assetsLoading } = useAssets(walletAddresses, chainId);

  const isLoading = walletsLoading || strategiesLoading || subscribersLoading || assetsLoading;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalUSD = assets.reduce((sum, a) => sum + a.valueUSD, 0);

  const displayStats = {
    totalAmountUSD: totalUSD,
    totalAmountChange: 0,
    totalStrategies: strategies.length,
    strategiesChange: 0,
    totalWallets: wallets.length,
    walletsChange: 0,
    totalSubscribers: subscribers.length,
    subscribersChange: 0,
  };

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">// account</p>
        <p className="uppercase">Overview</p>
      </div>
      <div className="w-full grid grid-cols-4 gap-4">
        <SubCard
          heading="Total Amount"
          main={formatCurrency(displayStats.totalAmountUSD)}
          incrementor={
            displayStats.totalAmountChange > 0
              ? `${displayStats.totalAmountChange >= 0 ? "+" : ""}${displayStats.totalAmountChange}%`
              : ""
          }
          isLoading={isLoading}
        />
        <SubCard
          heading="Strategies"
          main={displayStats.totalStrategies.toString()}
          incrementor={
            displayStats.strategiesChange > 0
              ? `${displayStats.strategiesChange >= 0 ? "+" : ""}${displayStats.strategiesChange}%`
              : ""
          }
          isLoading={isLoading}
        />
        <SubCard
          heading="Wallets"
          main={displayStats.totalWallets.toString()}
          incrementor={
            displayStats.walletsChange > 0
              ? `${displayStats.walletsChange >= 0 ? "+" : ""}${displayStats.walletsChange}%`
              : ""
          }
          isLoading={isLoading}
        />
        <SubCard
          heading="Subscribers"
          main={displayStats.totalSubscribers.toString()}
          incrementor={
            displayStats.subscribersChange > 0
              ? `${displayStats.subscribersChange >= 0 ? "+" : ""}${displayStats.subscribersChange}%`
              : ""
          }
          isLoading={isLoading}
        />
      </div>
    </CardLayout>
  );
};

export default OverviewCard;
