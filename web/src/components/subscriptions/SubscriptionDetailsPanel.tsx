"use client";

import CardLayout from "@/components/layouts/card-layout";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { Subscription } from "@/types";

interface SubscriptionDetailsPanelProps {
  selectedSubscription: Subscription;
  onClose: () => void;
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
}

const SubscriptionDetailsPanel = ({
  selectedSubscription,
  onClose,
  formatCurrency,
  formatDate,
}: SubscriptionDetailsPanelProps) => {
  const profit = selectedSubscription.currentValue - selectedSubscription.amountInvested;
  const profitPercentage = (profit / selectedSubscription.amountInvested) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-[40%] mt-[52px]"
    >
      <CardLayout>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-white/50">// subscription details</p>
            <p className="uppercase">{selectedSubscription.strategyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-700 border border-neutral-600 hover:border-primary/50 transition-all duration-200 group"
          >
            <X className="w-4 h-4 group-hover:text-primary transition-colors" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Strategy Creator</p>
            <p className="text-sm text-white/90">{selectedSubscription.strategyCreator}</p>
          </div>

          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Subscribed Date</p>
            <p className="text-sm text-white/90">
              {formatDate(selectedSubscription.subscribedAt)}
            </p>
          </div>

          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/50">Profit/Loss</span>
              <span className={`text-sm font-semibold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {profit >= 0 ? "+" : ""}{formatCurrency(profit)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Percentage</span>
              <span className={`text-sm font-semibold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                {profit >= 0 ? "+" : ""}{profitPercentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-neutral-800/50 border border-neutral-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Amount Invested</span>
              <span className="text-sm font-semibold">
                {formatCurrency(selectedSubscription.amountInvested)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Current Value</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(selectedSubscription.currentValue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">APY</span>
              <span className="text-sm font-semibold">
                {selectedSubscription.apy.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardLayout>
    </motion.div>
  );
};

export default SubscriptionDetailsPanel;
