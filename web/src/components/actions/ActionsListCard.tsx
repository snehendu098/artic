"use client";

import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconPlayerPlay,
  IconCreditCard,
  IconArrowDown,
  IconArrowUp,
  IconBulb,
  IconChevronDown,
} from "@tabler/icons-react";
import type { Action } from "@/types";

const typeIcons: Record<Action["type"], React.ReactNode> = {
  execution: <IconPlayerPlay className="w-4 h-4" />,
  subscription: <IconCreditCard className="w-4 h-4" />,
  withdrawal: <IconArrowUp className="w-4 h-4" />,
  deposit: <IconArrowDown className="w-4 h-4" />,
  strategy_created: <IconBulb className="w-4 h-4" />,
};

const statusColors: Record<Action["status"], string> = {
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  failed: "bg-red-500/20 text-red-400",
};

const ActionsListCardSkeleton = () => (
  <div className="w-full p-6 bg-neutral-900 border flex flex-col max-h-[80vh]">
    <div>
      <p className="text-xs text-white/50">// all activity</p>
      <p className="uppercase">Actions</p>
    </div>
    <div className="w-full space-y-3 mt-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-neutral-700 animate-pulse" />
            <div className="flex-1">
              <div className="h-3 bg-neutral-700 animate-pulse w-full mb-2" />
              <div className="h-3 bg-neutral-700 animate-pulse w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ActionsListCard = () => {
  const { data, loading } = useDashboardData();
  const { actions } = data;
  const isLoading = loading.actions;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedActions = useMemo(() => {
    if (!actions || actions.length === 0) return [];
    return [...actions].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [actions]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours < 1) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  if (isLoading) return <ActionsListCardSkeleton />;

  const hasData = sortedActions.length > 0;

  return (
    <div className="w-full p-6 bg-neutral-900 hover:border-primary transition duration-500 border flex flex-col max-h-[80vh]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// all activity</p>
          <p className="uppercase">Actions</p>
        </div>
        {hasData && (
          <span className="text-xs text-white/50">{sortedActions.length}</span>
        )}
      </div>
      {hasData ? (
        <div className="w-full space-y-2 mt-4 flex-1 overflow-y-auto scrollbar-hide min-h-0">
            {sortedActions.map((action) => {
              const isExpanded = expandedId === action.id;
              return (
                <div
                  key={action.id}
                  className="bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-200 cursor-pointer overflow-hidden"
                  onClick={() => setExpandedId(isExpanded ? null : action.id)}
                >
                  <div className="p-3 flex items-start gap-3">
                    <div className="text-white/50 mt-0.5 shrink-0">
                      {typeIcons[action.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed text-white/90 line-clamp-2 break-all">
                        {action.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-white/40">
                          {formatTime(action.timestamp)}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 ${statusColors[action.status]}`}
                        >
                          {action.status}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <IconChevronDown className="w-4 h-4 text-white/40" />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-0 border-t border-neutral-700">
                          <div className="pt-3 space-y-3">
                            <div className="min-w-0">
                              <p className="text-xs text-white/40 mb-1">Description</p>
                              <p className="text-xs text-white/90 leading-relaxed break-all">
                                {action.description}
                              </p>
                            </div>
                            {(action.strategyName || action.delegationWalletName) && (
                              <div className="space-y-1.5">
                                {action.strategyName && (
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-white/40 shrink-0">Strategy</span>
                                    <span className="text-xs text-white/70 truncate">
                                      {action.strategyName}
                                    </span>
                                  </div>
                                )}
                                {action.delegationWalletName && (
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-white/40 shrink-0">Wallet</span>
                                    <span className="text-xs text-white/70 truncate">
                                      {action.delegationWalletName}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                            {action.note && (
                              <div className="min-w-0">
                                <p className="text-xs text-white/40 mb-1">Note</p>
                                <p className="text-xs text-white/70 leading-relaxed break-all">
                                  {action.note}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-white/40">No activity yet</p>
            <p className="text-xs text-white/30 mt-1">Actions will appear here</p>
          </div>
        )}
    </div>
  );
};

export default ActionsListCard;
