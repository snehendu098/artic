"use client";

import { dummyStrategies } from "@/constants/data";
import { useState } from "react";
import type { Strategy } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import StrategyRow from "@/components/strategies/StrategyRow";
import StrategyDetailsPanel from "@/components/strategies/StrategyDetailsPanel";

const StrategiesPage = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Strategies"
      subtitle="// yield optimizers"
      isPanelOpen={!!selectedStrategy}
      sidePanel={
        selectedStrategy && (
          <StrategyDetailsPanel
            selectedStrategy={selectedStrategy}
            onClose={() => setSelectedStrategy(null)}
            formatCurrency={formatCurrency}
          />
        )
      }
    >
      <div className="w-full space-y-2">
        {dummyStrategies.map((strategy) => (
          <StrategyRow
            key={strategy.id}
            strategy={strategy}
            formatCurrency={formatCurrency}
            onClick={() => setSelectedStrategy(strategy)}
            isSelected={selectedStrategy?.id === strategy.id}
          />
        ))}
      </div>
    </SplitPanelLayout>
  );
};

export default StrategiesPage;
