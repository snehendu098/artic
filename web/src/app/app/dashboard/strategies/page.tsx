"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import type { Strategy } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import StrategyRow from "@/components/strategies/StrategyRow";
import StrategyDetailsPanel from "@/components/strategies/StrategyDetailsPanel";
import { useStrategies } from "@/hooks/useStrategies";

const StrategiesPage = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: strategies, isLoading } = useStrategies(walletAddress);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Strategies"
      subtitle="// your strategies"
      isPanelOpen={!!selectedStrategy}
      sidePanel={
        selectedStrategy && (
          <StrategyDetailsPanel
            selectedStrategy={selectedStrategy}
            onClose={() => setSelectedStrategy(null)}
          />
        )
      }
    >
      <div className="w-full space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        ) : strategies.length === 0 ? (
          <div className="text-center py-12 text-sm text-white/50">
            No strategies yet
          </div>
        ) : (
          strategies.map((strategy) => (
            <StrategyRow
              key={strategy.id}
              strategy={strategy}
              onClick={() => setSelectedStrategy(strategy)}
              isSelected={selectedStrategy?.id === strategy.id}
            />
          ))
        )}
      </div>
    </SplitPanelLayout>
  );
};

export default StrategiesPage;
