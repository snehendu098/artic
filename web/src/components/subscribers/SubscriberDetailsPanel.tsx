"use client";

import CardLayout from "@/components/layouts/card-layout";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { Subscriber } from "@/types";

interface SubscriberDetailsPanelProps {
  selectedSubscriber: Subscriber;
  onClose: () => void;
  formatDate: (dateString: string) => string;
}

const SubscriberDetailsPanel = ({
  selectedSubscriber,
  onClose,
  formatDate,
}: SubscriberDetailsPanelProps) => {
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
            <p className="text-xs text-white/50">// subscriber details</p>
            <p className="uppercase">{selectedSubscriber.username}</p>
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
            <p className="text-xs text-white/50 mb-2">Username</p>
            <p className="text-sm text-white/90">{selectedSubscriber.username}</p>
          </div>

          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Strategy</p>
            <p className="text-sm text-white/90">{selectedSubscriber.strategyName}</p>
          </div>

          <div className="p-3 bg-neutral-800 border border-neutral-700">
            <p className="text-xs text-white/50 mb-2">Subscribed Date</p>
            <p className="text-sm text-white/90">
              {formatDate(selectedSubscriber.subscribedAt)}
            </p>
          </div>
        </div>
      </CardLayout>
    </motion.div>
  );
};

export default SubscriberDetailsPanel;
