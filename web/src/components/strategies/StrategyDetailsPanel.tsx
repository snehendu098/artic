"use client";

import CardLayout from "@/components/layouts/card-layout";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { Strategy } from "@/types";

interface StrategyDetailsPanelProps {
  selectedStrategy: Strategy;
  onClose: () => void;
}

const StrategyDetailsPanel = ({
  selectedStrategy,
  onClose,
}: StrategyDetailsPanelProps) => {
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
            <p className="text-xs text-white/50">// strategy details</p>
            <p className="uppercase">{selectedStrategy.name}</p>
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
            <p className="text-xs text-white/50 mb-2">Strategy Code</p>
            <p className="text-sm text-white/90">{selectedStrategy.strategyCode || "No strategy code"}</p>
          </div>

          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Protocols</p>
            <div className="flex flex-wrap gap-2">
              {selectedStrategy.protocols.map((protocol, index) => (
                <motion.span
                  key={protocol}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-2 py-1 bg-neutral-700 text-xs text-white/80 border border-neutral-600"
                >
                  {protocol}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Status</p>
            <span
              className={`inline-block px-2 py-1 text-xs ${
                selectedStrategy.status === "active"
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : selectedStrategy.status === "paused"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-neutral-700 text-white/60 border border-neutral-600"
              }`}
            >
              {selectedStrategy.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-neutral-800/50 border border-neutral-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Subscribers</span>
              <span className="text-sm font-semibold">
                {selectedStrategy.subscriberCount}
              </span>
            </div>
            {selectedStrategy.isPublic && selectedStrategy.priceMnt && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Price</span>
                <span className="text-sm font-semibold text-primary">
                  {selectedStrategy.priceMnt} MNT
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Visibility</span>
              <span className={`text-sm font-semibold ${
                selectedStrategy.isPublic ? "text-green-400" : "text-white/70"
              }`}>
                {selectedStrategy.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>
        </div>
      </CardLayout>
    </motion.div>
  );
};

export default StrategyDetailsPanel;
