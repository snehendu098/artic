"use client";

import { useState } from "react";
import { usePrivy, useWallets as usePrivyWallets } from "@privy-io/react-auth";
import { mantleSepoliaTestnet } from "viem/chains";
import type { Asset } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import AssetRow from "@/components/assets/AssetRow";
import WalletDistributionPanel from "@/components/assets/WalletDistributionPanel";
import { useWallets, useAssets } from "@/hooks";

const AssetsPage = () => {
  const { authenticated, user } = usePrivy();
  const { wallets: privyWallets } = usePrivyWallets();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const walletAddress = user?.wallet?.address;
  const activeWallet = privyWallets.find((w) => w.address === walletAddress);
  const walletChainId = activeWallet?.chainId;
  const chainId = walletChainId
    ? parseInt(walletChainId.split(":")[1])
    : mantleSepoliaTestnet.id;

  const { data: delegationWallets, isLoading: walletsLoading } = useWallets(walletAddress);
  const walletAddresses = delegationWallets.map((w) => w.address);
  const { data: assets, isLoading: assetsLoading } = useAssets(walletAddresses, chainId);

  const isLoading = walletsLoading || assetsLoading;

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

  const getWalletName = (address: string) => {
    const wallet = delegationWallets.find(
      (w) => w.address.toLowerCase() === address.toLowerCase()
    );
    return wallet?.name || "Unknown Wallet";
  };

  if (!authenticated) {
    return (
      <SplitPanelLayout
        backUrl="/app/dashboard"
        title="All Assets"
        subtitle="// portfolio overview"
        isPanelOpen={false}
        sidePanel={null}
      >
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-white/50">Connect wallet to view assets</p>
        </div>
      </SplitPanelLayout>
    );
  }

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="All Assets"
      subtitle="// portfolio overview"
      isPanelOpen={!!selectedAsset}
      sidePanel={
        selectedAsset && (
          <WalletDistributionPanel
            selectedAsset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            formatCurrency={formatCurrency}
            formatAssetAmount={formatAssetAmount}
            shortenAddress={shortenAddress}
            getWalletName={getWalletName}
          />
        )
      }
    >
      <div className="w-full space-y-2">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 bg-neutral-900 border border-neutral-700 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-700" />
                  <div>
                    <div className="h-4 bg-neutral-700 w-12 mb-1" />
                    <div className="h-3 bg-neutral-700 w-20" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-neutral-700 w-16 mb-1" />
                  <div className="h-3 bg-neutral-700 w-12" />
                </div>
              </div>
            </div>
          ))
        ) : assets.length > 0 ? (
          assets.map((asset) => (
            <AssetRow
              key={asset.id}
              asset={asset}
              formatCurrency={formatCurrency}
              formatAssetAmount={formatAssetAmount}
              onClick={() => setSelectedAsset(asset)}
              isSelected={selectedAsset?.id === asset.id}
            />
          ))
        ) : (
          <div className="p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-white/40">No assets yet</p>
            <p className="text-xs text-white/30 mt-1">Deposit funds to your wallets to see assets</p>
          </div>
        )}
      </div>
    </SplitPanelLayout>
  );
};

export default AssetsPage;
