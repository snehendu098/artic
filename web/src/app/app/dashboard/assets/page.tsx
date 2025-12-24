"use client";

import { dummyAssets, dummyWallets } from "@/constants/data";
import { useState } from "react";
import type { Asset } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import AssetRow from "@/components/assets/AssetRow";
import WalletDistributionPanel from "@/components/assets/WalletDistributionPanel";

const AssetsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

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
    const wallet = dummyWallets.find((w) => w.address === address);
    return wallet?.name || "Unknown Wallet";
  };

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
        {dummyAssets.map((asset) => (
          <AssetRow
            key={asset.id}
            asset={asset}
            formatCurrency={formatCurrency}
            formatAssetAmount={formatAssetAmount}
            onClick={() => setSelectedAsset(asset)}
            isSelected={selectedAsset?.id === asset.id}
          />
        ))}
      </div>
    </SplitPanelLayout>
  );
};

export default AssetsPage;
