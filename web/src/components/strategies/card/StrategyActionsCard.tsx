"use client";

import CardLayout from "@/components/layouts/card-layout";
import { Activity } from "lucide-react";
import type { Action } from "@/types";

interface StrategyActionsCardProps {
  actions: Action[];
  formatDate: (timestamp: string) => string;
}

const StrategyActionsCard = ({
  actions,
  formatDate,
}: StrategyActionsCardProps) => {
  if (actions.length === 0) return null;

  return (
    <CardLayout>
      <p className="text-xs text-white/50 mb-3">// recent actions</p>
      <div className="space-y-2">
        {actions.map((action) => (
          <div
            key={action.id}
            className="p-2.5 bg-neutral-800 border border-neutral-700"
          >
            <div className="flex items-start gap-2">
              <div className="p-1 bg-neutral-700 mt-0.5 shrink-0">
                <Activity className="w-3 h-3 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/90 break-words">{action.description}</p>
                <p className="text-xs text-white/40 mt-1">
                  {formatDate(action.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardLayout>
  );
};

export default StrategyActionsCard;
