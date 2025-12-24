"use client";

import { TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Strategy } from "@/types";

interface StrategyRowProps {
  strategy: Strategy;
  formatCurrency: (value: number) => string;
  onClick: () => void;
  isSelected: boolean;
}

const StrategyRow = ({
  strategy,
  formatCurrency,
  onClick,
  isSelected,
}: StrategyRowProps) => {
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
            <p className="text-sm font-medium truncate">{strategy.name}</p>
            <p className="text-xs text-white/40 mt-0.5 truncate">
              {strategy.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative ml-3">
          <motion.div
            animate={{
              x: isHovered ? -60 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-right"
          >
            <p className="text-sm font-semibold">{strategy.apy.toFixed(1)}% APY</p>
            <p className="text-xs text-white/50 mt-0.5">
              {formatCurrency(strategy.tvl)} TVL
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 20,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center gap-1.5 absolute right-0 bg-neutral-700/80 px-2 py-1"
          >
            <Users className="w-3.5 h-3.5 text-white" />
            <span className="text-xs text-white font-medium">
              {strategy.subscriberCount}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StrategyRow;
