"use client";

import { motion } from "framer-motion";
import type { Action } from "@/types";

interface ActionRowProps {
  action: Action;
  formatCurrency?: (value: number) => string;
  formatDate: (timestamp: string) => string;
}

const ActionRow = ({ action, formatDate }: ActionRowProps) => {
  return (
    <motion.div
      className="p-3 bg-neutral-900 border border-neutral-700 hover:border-neutral-600 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm text-white/90">{action.description}</p>
          {action.note && (
            <p className="text-xs text-white/50 mt-0.5">{action.note}</p>
          )}
          <p className="text-xs text-white/40 mt-1">
            {formatDate(action.timestamp)}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`inline-block px-2 py-0.5 text-xs ${
              action.status === "completed"
                ? "bg-green-500/20 text-green-400"
                : action.status === "pending"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {action.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionRow;
