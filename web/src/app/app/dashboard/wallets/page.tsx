"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { ProgressiveWallet } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import WalletRow from "@/components/wallets/WalletRow";
import AssetDistributionPanel from "@/components/wallets/AssetDistributionPanel";
import { useProgressiveWallets } from "@/hooks";

const WalletsPage = () => {
  const { authenticated, user } = usePrivy();
  const [selectedWallet, setSelectedWallet] = useState<ProgressiveWallet | null>(null);

  const walletAddress = user?.wallet?.address;
  const { wallets, phase } = useProgressiveWallets(authenticated ? walletAddress : undefined);

  const isLoading = phase === "idle" || phase === "wallets";

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

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!authenticated) {
    return (
      <SplitPanelLayout
        backUrl="/app/dashboard"
        title="Wallets"
        subtitle="// wallet management"
        isPanelOpen={false}
        sidePanel={null}
      >
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-white/50">Connect wallet to view</p>
        </div>
      </SplitPanelLayout>
    );
  }

  // Get the latest wallet data from the array to reflect loading state updates
  const currentWallet = selectedWallet
    ? wallets.find((w) => w.id === selectedWallet.id) ?? selectedWallet
    : null;

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Wallets"
      subtitle="// wallet management"
      isPanelOpen={!!currentWallet}
      sidePanel={
        currentWallet && (
          <AssetDistributionPanel
            selectedWallet={currentWallet}
            onClose={() => setSelectedWallet(null)}
            formatCurrency={formatCurrency}
            formatAssetAmount={formatAssetAmount}
          />
        )
      }
    >
      <div className="w-full space-y-2">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-neutral-900 border border-neutral-700 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-700" />
                  <div>
                    <div className="h-4 bg-neutral-700 w-24 mb-1" />
                    <div className="h-3 bg-neutral-700 w-32" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-neutral-700 w-16 mb-1" />
                  <div className="h-3 bg-neutral-700 w-12" />
                </div>
              </div>
            </div>
          ))
        ) : wallets.length > 0 ? (
          wallets.map((wallet) => (
            <WalletRow
              key={wallet.id}
              wallet={wallet}
              formatCurrency={formatCurrency}
              shortenAddress={shortenAddress}
              onClick={() => setSelectedWallet(wallet)}
              isSelected={currentWallet?.id === wallet.id}
            />
          ))
        ) : (
          <div className="p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-white/40">No wallets yet</p>
            <p className="text-xs text-white/30 mt-1">Create a delegation wallet from the dashboard</p>
          </div>
        )}
      </div>
    </SplitPanelLayout>
  );
};

export default WalletsPage;
