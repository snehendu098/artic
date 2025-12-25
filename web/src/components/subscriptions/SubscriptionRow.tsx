"use client";

import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Subscription } from "@/types";

interface SubscriptionRowProps {
  subscription: Subscription;
  onClick: () => void;
  isSelected: boolean;
}

const SubscriptionRow = ({
  subscription,
  onClick,
  isSelected,
}: SubscriptionRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`p-3 bg-neutral-900 border transition-all duration-200 cursor-pointer overflow-hidden ${
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
            <p className="text-sm font-medium truncate">
              {subscription.strategyName}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              by {subscription.strategyCreator}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative ml-3">
          <div className="text-right">
            <p className="text-xs text-white/50 truncate max-w-[120px]">
              {subscription.delegationWalletName}
            </p>
            <span
              className={`text-xs mt-0.5 inline-block px-1.5 py-0.5 ${
                subscription.isActive
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {subscription.isActive ? "Active" : "Paused"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionRow;
