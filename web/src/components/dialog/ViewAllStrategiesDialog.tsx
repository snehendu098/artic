"use client";

import { useState } from "react";
import {
  InfoPopup,
  InfoPopupTrigger,
  InfoPopupContent,
} from "@/components/ui/info-popup";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, TrendingUp } from "lucide-react";
import { dummyStrategies } from "@/constants/data";
import Header from "@/components/common/Header";

export default function ViewAllStrategiesDialog() {
  const [open, setOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalTVL = dummyStrategies.reduce((sum, strategy) => sum + strategy.tvl, 0);
  const totalSubscribers = dummyStrategies.reduce(
    (sum, strategy) => sum + strategy.subscriberCount,
    0
  );

  return (
    <InfoPopup open={open} onOpenChange={setOpen}>
      <InfoPopupTrigger asChild>
        <button className="w-full mt-3 py-2 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 flex items-center justify-center gap-2 group">
          <span className="text-xs text-white/70 group-hover:text-primary transition-colors">
            View All
          </span>
          <ArrowRight className="w-3 h-3 text-white/70 group-hover:text-primary transition-colors" />
        </button>
      </InfoPopupTrigger>

      <InfoPopupContent>
        <div className="h-full flex flex-col items-center">
          <div className="w-full max-w-5xl flex flex-col h-full">
            {/* Header */}
            <div className="px-8 py-6 flex-shrink-0">
              <Header
                url="/strategies"
                name="Strategies"
                description="All your created yield optimization strategies"
                indexEnabled={false}
              />
            </div>

            {/* Stats */}
            <div className="px-8 py-4 flex-shrink-0 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/50 mb-1">Total TVL</p>
                <p className="text-2xl font-semibold text-primary">
                  {formatCurrency(totalTVL)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Total Subscribers</p>
                <p className="text-2xl font-semibold text-primary">
                  {totalSubscribers}
                </p>
              </div>
            </div>

            {/* Strategies List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="px-8 pb-8 space-y-3">
                <AnimatePresence mode="popLayout">
                  {dummyStrategies.map((strategy, index) => (
                    <motion.div
                      key={strategy.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="p-4 border border-neutral-700 bg-neutral-800/50 hover:border-primary/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold mb-1 group-hover:text-primary transition-colors">
                            {strategy.name}
                          </h3>
                          <p className="text-sm text-white/50 mb-3">
                            {strategy.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {strategy.protocols.map((protocol) => (
                              <span
                                key={protocol}
                                className="px-2 py-1 bg-neutral-700/50 text-xs text-white/70"
                              >
                                {protocol}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-white/50">
                            <span className={`px-2 py-0.5 ${
                              strategy.status === "active"
                                ? "bg-primary/20 text-primary"
                                : "bg-neutral-700 text-white/50"
                            }`}>
                              {strategy.status}
                            </span>
                            <span>Created {new Date(strategy.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="mb-3">
                            <p className="text-xs text-white/50">APY</p>
                            <p className="text-lg font-semibold text-primary">
                              {strategy.apy}%
                            </p>
                          </div>
                          <div className="mb-3">
                            <p className="text-xs text-white/50">TVL</p>
                            <p className="text-sm font-medium">
                              {formatCurrency(strategy.tvl)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <Users className="w-3 h-3 text-white/50" />
                            <span className="text-xs text-white/50">
                              {strategy.subscriberCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </InfoPopupContent>
    </InfoPopup>
  );
}
