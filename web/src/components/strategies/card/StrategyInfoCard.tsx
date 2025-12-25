"use client";

import CardLayout from "@/components/layouts/card-layout";
import { TrendingUp, Pause, Play } from "lucide-react";
import type { Strategy } from "@/types";

type UserStatus = "active" | "paused" | "draft" | "not_activated";

interface StrategyInfoCardProps {
  strategy: Strategy;
  userStatus: UserStatus;
  isActive: boolean;
  onToggleStatus: () => void;
  showToggle?: boolean;
}

const StrategyInfoCard = ({
  strategy,
  userStatus,
  isActive,
  onToggleStatus,
  showToggle = true,
}: StrategyInfoCardProps) => {
  const statusColor: Record<UserStatus, string> = {
    active: "bg-green-500",
    paused: "bg-yellow-500",
    draft: "bg-neutral-500",
    not_activated: "bg-blue-500",
  };

  const statusLabel: Record<UserStatus, string> = {
    active: "Active",
    paused: "Paused",
    draft: "Draft",
    not_activated: "Not Activated",
  };

  const canToggle = showToggle && (userStatus === "active" || userStatus === "paused");

  return (
    <CardLayout>
      <div className="relative">
        {/* Status Indicator - Top Right */}
        <div className="absolute -top-3 -right-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${statusColor[userStatus]}`} />
            <span className="text-xs text-white/70">{statusLabel[userStatus]}</span>
          </div>
          {canToggle && (
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
          )}
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-neutral-700">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 pr-32">
            <p className="text-xs text-white/50">Strategy</p>
            <p className="text-sm font-medium mt-0.5">{strategy.name}</p>

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
