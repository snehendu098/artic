"use client";

import { User } from "lucide-react";
import { motion } from "framer-motion";
import type { Subscriber } from "@/types";

interface SubscriberRowProps {
  subscriber: Subscriber;
  formatDate: (dateString: string) => string;
  onClick: () => void;
  isSelected: boolean;
}

const SubscriberRow = ({
  subscriber,
  formatDate,
  onClick,
  isSelected,
}: SubscriberRowProps) => {
  return (
    <motion.div
      onClick={onClick}
      className={`p-3 bg-neutral-900 border transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-primary/50"
          : "border-neutral-700 hover:border-neutral-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-700">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{subscriber.username}</p>
            <p className="text-xs text-white/40 mt-0.5">
              {formatDate(subscriber.subscribedAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/70 truncate max-w-[150px]">
            {subscriber.strategyName}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriberRow;
