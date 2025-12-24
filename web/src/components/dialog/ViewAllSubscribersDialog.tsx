"use client";

import { useState } from "react";
import {
  InfoPopup,
  InfoPopupTrigger,
  InfoPopupContent,
} from "@/components/ui/info-popup";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { dummySubscribers } from "@/constants/data";
import Header from "@/components/common/Header";

export default function ViewAllSubscribersDialog() {
  const [open, setOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalInvested = dummySubscribers.reduce(
    (sum, sub) => sum + sub.amountInvested,
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
                url="/subscribers"
                name="Subscribers"
                description="People subscribed to your strategies"
                indexEnabled={false}
              />
            </div>

            {/* Stats */}
            <div className="px-8 py-4 flex-shrink-0">
              <p className="text-xs text-white/50 mb-1">Total Capital Invested</p>
              <p className="text-3xl font-semibold text-primary">
                {formatCurrency(totalInvested)}
              </p>
            </div>

            {/* Subscribers List */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="px-8 pb-8 space-y-3">
                <AnimatePresence mode="popLayout">
                  {dummySubscribers.map((subscriber, index) => (
                    <motion.div
                      key={subscriber.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                      className="p-4 border border-neutral-700 bg-neutral-800/50 hover:border-neutral-600 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-700 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{subscriber.username}</p>
                            <p className="text-xs text-white/50 mb-1">
                              {subscriber.strategyName}
                            </p>
                            <p className="text-xs text-white/40">
                              Subscribed {formatDate(subscriber.subscribedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/50 mb-1">Amount Invested</p>
                          <p className="text-lg font-semibold text-primary">
                            {formatCurrency(subscriber.amountInvested)}
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
