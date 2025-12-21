"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";

export interface WalletActionItemProps {
  action: string;
  stateChange: string;
  strategyName?: string;
  createdAt: Date | string;
}

const WalletActionItem = ({
  action,
  stateChange,
  strategyName,
  createdAt,
}: WalletActionItemProps) => {
  const createdDate = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div className="w-full px-4 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground/90 truncate">
            {action}
          </p>
          {stateChange && (
            <p className="text-xs text-foreground/60 mt-1 truncate">
              {stateChange}
            </p>
          )}
          {strategyName && (
            <p className="text-xs text-foreground/50 mt-1">
              Strategy: {strategyName}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-foreground/50 whitespace-nowrap">
            {timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletActionItem;
