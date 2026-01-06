"use client";

import CardLayout from "@/components/layouts/card-layout";
import { useDashboardData } from "@/contexts/DashboardDataContext";
import { useMemo } from "react";

const ActiveStrategyCardSkeleton = () => (
  <CardLayout>
    <div>
      <p className="text-xs text-white/50">// currently running</p>
      <p className="uppercase">Active Strategies</p>
    </div>
    <div className="w-full space-y-3 mt-4">
      {[1, 2].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="h-4 bg-neutral-700 animate-pulse w-[60%] mb-2" />
          <div className="h-3 bg-neutral-700 animate-pulse w-[40%]" />
        </div>
      ))}
    </div>
  </CardLayout>
);

const ActiveStrategyCard = () => {
  const { data, loading } = useDashboardData();
  const { subscriptions } = data;
  const isLoading = loading.subscriptions;

  const activeSubscriptions = useMemo(() => {
    if (!subscriptions) return [];
    return subscriptions.filter((s) => s.isActive);
  }, [subscriptions]);

  if (isLoading) return <ActiveStrategyCardSkeleton />;

  const hasData = activeSubscriptions.length > 0;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// currently running</p>
          <p className="uppercase">Active Strategies</p>
        </div>
        {hasData && (
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5">
            {activeSubscriptions.length} active
          </span>
        )}
      </div>
      {hasData ? (
        <div className="w-full space-y-3 mt-4">
          {activeSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-3 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {sub.strategyName}
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {sub.delegationWalletName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/40">No active strategies</p>
          <p className="text-xs text-white/30 mt-1">
            Subscribe to a strategy to start execution
          </p>
        </div>
      )}
    </CardLayout>
  );
};

export default ActiveStrategyCard;
