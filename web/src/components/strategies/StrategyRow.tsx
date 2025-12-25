"use client";

import { TrendingUp } from "lucide-react";
import type { Strategy } from "@/types";

interface StrategyRowProps {
  strategy: Strategy;
  onClick: () => void;
  isSelected: boolean;
}

const StrategyRow = ({
  strategy,
  onClick,
  isSelected,
}: StrategyRowProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 bg-neutral-900 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-primary/50"
          : "border-neutral-700 hover:border-neutral-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-neutral-700">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium truncate">{strategy.name}</p>
            <p className="text-xs text-white/40 mt-0.5 truncate">
              {strategy.description}
            </p>
          </div>
        </div>
        <div className="text-right ml-3">
          <span className={`text-xs px-2 py-0.5 ${
            strategy.status === "active"
              ? "bg-green-500/20 text-green-400"
              : strategy.status === "paused"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-neutral-700 text-white/50"
          }`}>
            {strategy.status}
          </span>
          <p className="text-xs text-white/50 mt-1">
            {strategy.subscriberCount} subscribers
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategyRow;
