"use client";

import { dummyWallets } from "@/constants/data";
import { useState } from "react";
import type { Wallet } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import WalletRow from "@/components/wallets/WalletRow";
import AssetDistributionPanel from "@/components/wallets/AssetDistributionPanel";

const WalletsPage = () => {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

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

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Wallets"
      subtitle="// wallet management"
      isPanelOpen={!!selectedWallet}
      sidePanel={
        selectedWallet && (
          <AssetDistributionPanel
            selectedWallet={selectedWallet}
            onClose={() => setSelectedWallet(null)}
            formatCurrency={formatCurrency}
            formatAssetAmount={formatAssetAmount}
          />
        )
      }
    >
      <div className="w-full space-y-2">
        {dummyWallets.map((wallet) => (
          <WalletRow
            key={wallet.id}
            wallet={wallet}
            formatCurrency={formatCurrency}
            shortenAddress={shortenAddress}
            onClick={() => setSelectedWallet(wallet)}
            isSelected={selectedWallet?.id === wallet.id}
          />
        ))}
      </div>
    </SplitPanelLayout>
  );
};

export default WalletsPage;
