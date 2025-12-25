"use client";

import { useState } from "react";
import {
  InfoPopup,
  InfoPopupTrigger,
  InfoPopupContent,
} from "@/components/ui/info-popup";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { dummySubscriptions } from "@/constants/data";
import Header from "@/components/common/Header";

export default function ViewAllSubscriptionsDialog() {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const activeCount = dummySubscriptions.filter(s => s.isActive).length;
  const pausedCount = dummySubscriptions.length - activeCount;

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
                url="/subscriptions"
                name="Subscriptions"
                description="Strategies you're subscribed to"
                indexEnabled={false}
              />
            </div>

            {/* Stats */}
            <div className="px-8 py-4 flex-shrink-0 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-white/50 mb-1">Total Subscriptions</p>
                <p className="text-2xl font-semibold text-primary">
                  {dummySubscriptions.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Active</p>
                <p className="text-2xl font-semibold text-green-400">
                  {activeCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Paused</p>
                <p className="text-2xl font-semibold text-yellow-400">
                  {pausedCount}
                </p>
              </div>
            </div>

            {/* Subscriptions List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="px-8 pb-8 space-y-3">
                <AnimatePresence mode="popLayout">
                  {dummySubscriptions.map((subscription) => (
                    <motion.div
                      key={subscription.id}
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
                            {subscription.strategyName}
                          </h3>
                          <p className="text-xs text-white/50 mb-3">
                            by {subscription.strategyCreator}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-white/50">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {subscription.delegationWalletName}
                            </span>
                            <span>
                              Subscribed {formatDate(subscription.subscribedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`inline-block px-2 py-1 text-xs mb-2 ${
                            subscription.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {subscription.isActive ? "Active" : "Paused"}
                          </span>
                          <p className="text-xs text-white/40 font-mono truncate max-w-[150px]">
                            {subscription.delegationWalletAddress}
                          </p>
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
