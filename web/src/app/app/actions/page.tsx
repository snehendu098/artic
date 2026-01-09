"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { mantle } from "viem/chains";
import Header from "@/components/common/Header";
import ActionsTimelineChart from "@/components/actions/ActionsTimelineChart";
import ActiveStrategyCard from "@/components/actions/ActiveStrategyCard";
import ActionsListCard from "@/components/actions/ActionsListCard";
import LiveExecutionFeedCard from "@/components/actions/LiveExecutionFeedCard";
import { DashboardDataProvider } from "@/contexts/DashboardDataContext";

const ActionsContent = () => {
  return (
    <div className="w-full grid grid-cols-5 gap-6 items-start">
      <div className="w-full col-span-3 space-y-6">
        <ActionsTimelineChart />
        <ActiveStrategyCard />
        <LiveExecutionFeedCard />
      </div>
      <div className="w-full col-span-2 h-full self-stretch">
        <ActionsListCard />
      </div>
    </div>
  );
};

const ActionsPage = () => {
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
      <div className="w-full space-y-2">
        <Header url="/app/actions" />
        <div className="mt-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-white/50">Connect wallet to view actions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Header url="/app/actions" />
      <DashboardDataProvider walletAddress={walletAddress} chainId={chainId}>
        <ActionsContent />
      </DashboardDataProvider>
    </div>
  );
};

export default ActionsPage;
