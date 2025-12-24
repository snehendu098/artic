"use client";

import CardLayout from "@/components/layouts/card-layout";
import { TrendingUp, Pause, Play } from "lucide-react";
import type { Strategy } from "@/types";

interface StrategyInfoCardProps {
  strategy: Strategy;
  isActive: boolean;
  onToggleStatus: () => void;
}

const StrategyInfoCard = ({
  strategy,
  isActive,
  onToggleStatus,
}: StrategyInfoCardProps) => {
  return (
    <CardLayout>
      <div className="relative">
        {/* Status Indicator - Top Right */}
        <div className="absolute -top-3 -right-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-green-500" : "bg-neutral-500"
              }`}
            />
            <span className="text-xs text-white/70">
              {isActive ? "Active" : "Paused"}
            </span>
          </div>
          <button
            onClick={onToggleStatus}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 hover:border-primary/50 transition-all text-xs text-white/90"
          >
            {isActive ? (
              <>
                <Pause className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Resume</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-neutral-700">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 pr-32">
            <p className="text-xs text-white/50">Strategy</p>
            <p className="text-sm font-medium mt-0.5">{strategy.name}</p>
            <p className="text-xs text-white/70 mt-2">{strategy.description}</p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {strategy.protocols.map((protocol) => (
                <span
                  key={protocol}
                  className="px-2 py-0.5 bg-neutral-700 text-xs text-white/80 border border-neutral-600"
                >
                  {protocol}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default StrategyInfoCard;
