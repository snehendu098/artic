"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { mantle } from "viem/chains";
import Header from "@/components/common/Header";
import OverviewCard from "@/components/home/cards/OverviewCard";
import StrategiesCard from "@/components/home/cards/StrategiesCard";
import CombinedAssetCard from "@/components/home/cards/CombinedAssetCard";
import SubscriptionsCard from "@/components/home/cards/SubscriptionsCard";
import WalletsCard from "@/components/home/cards/WalletsCard";
import SubscribersCard from "@/components/home/cards/SubscribersCard";
import { DashboardDataProvider, useDashboardData } from "@/contexts/DashboardDataContext";

const DashboardContent = () => {
  return (
    <div className="w-full grid gap-4 grid-cols-6">
      <div className="col-span-4 space-y-4">
        <OverviewCard />
        <div className="w-full">
          <CombinedAssetCard />
        </div>
        <div className="w-full space-x-4 grid grid-cols-2 gap-4">
          <SubscriptionsCard />
          <SubscribersCard />
        </div>
      </div>
      <div className="col-span-2 space-y-4">
        <WalletsCard />
        <StrategiesCard />
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const { refetchGroup } = useDashboardData();
  return (
    <div className="w-full">
      <Header url="/app/dashboard" showActions={true} onWalletCreated={refetchGroup.wallets} />
      <div className="mt-6">
        <DashboardContent />
      </div>
    </div>
  );
};

const DashboardClient = () => {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  const walletAddress = user?.wallet?.address;
  const activeWallet = wallets.find((w) => w.address === walletAddress);
  const walletChainId = activeWallet?.chainId;
  const chainId = walletChainId
    ? parseInt(walletChainId.split(":")[1])
    : mantle.id;

  if (!authenticated) {
    return (
      <div className="w-full">
        <Header url="/app/dashboard" showActions={true} />
        <div className="mt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-white/50 mb-2">
              Connect your wallet to view dashboard
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardDataProvider walletAddress={walletAddress} chainId={chainId}>
      <DashboardLayout />
    </DashboardDataProvider>
  );
};

export default DashboardClient;
