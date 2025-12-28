"use client";

import CardLayout from "@/components/layouts/card-layout";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDashboardData } from "@/contexts/DashboardDataContext";

const SubscriptionsCardSkeleton = () => (
  <CardLayout>
    <div>
      <p className="text-xs text-white/50">// active subscriptions</p>
      <p className="uppercase">Subscriptions</p>
    </div>
    <div className="w-full space-y-2 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-center justify-between gap-2">
            <div className="h-4 bg-neutral-700 animate-pulse w-[50%]" />
            <div className="h-5 bg-neutral-700 animate-pulse w-14" />
          </div>
        </div>
      ))}
    </div>
  </CardLayout>
);

const SubscriptionsCard = () => {
  const { data, loading } = useDashboardData();
  const { subscriptions } = data;
  const isLoading = loading.subscriptions;

  if (isLoading) return <SubscriptionsCardSkeleton />;

  const hasData = subscriptions && subscriptions.length > 0;
  const maxDisplay = 3;
  const hasMore = hasData && subscriptions.length > maxDisplay;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// active subscriptions</p>
          <p className="uppercase">Subscriptions</p>
        </div>
        {hasData && !hasMore && (
          <Link href="/app/dashboard/subscriptions">
            <button className="p-1.5 bg-neutral-700 border border-neutral-600 transition-all duration-300 ease-out group hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
              <ArrowRight className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
            </button>
          </Link>
        )}
      </div>
      {hasData ? (
        <div className="w-full space-y-2 mt-4">
          {subscriptions.slice(0, maxDisplay).map((subscription) => (
            <div
              key={subscription.id}
              className="p-3 bg-neutral-800 border border-neutral-700 hover:border-primary/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                    {subscription.strategyName}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 flex-shrink-0 ${
                    subscription.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-neutral-700 text-white/50"
                  }`}
                >
                  {subscription.isActive ? "Active" : "Paused"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/40">No subscriptions yet</p>
          <p className="text-xs text-white/30 mt-1">Subscribe to strategies to see them here</p>
        </div>
      )}
      {hasMore && (
        <Link href="/app/dashboard/subscriptions">
          <button className="w-full mt-3 py-2 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 flex items-center justify-center gap-2 group">
            <span className="text-xs text-white/70 group-hover:text-primary transition-colors">
              View All
            </span>
            <ArrowRight className="w-3 h-3 text-white/70 group-hover:text-primary transition-colors" />
          </button>
        </Link>
      )}
    </CardLayout>
  );
};

export default SubscriptionsCard;
