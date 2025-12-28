"use client";

import CardLayout from "@/components/layouts/card-layout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useDashboardData } from "@/contexts/DashboardDataContext";

const ActionsCardSkeleton = () => (
  <CardLayout>
    <div>
      <p className="text-xs text-white/50">// recent activity</p>
      <p className="uppercase">Actions</p>
    </div>
    <div className="w-full space-y-3 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="h-3 bg-neutral-700 animate-pulse w-full mb-2" />
              <div className="h-3 bg-neutral-700 animate-pulse w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardLayout>
);

const ActionsCard = () => {
  const { data, loading } = useDashboardData();
  const { actions } = data;
  const isLoading = loading.actions;

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

  if (isLoading) return <ActionsCardSkeleton />;

  const hasData = actions && actions.length > 0;
  const maxDisplay = 3;
  const hasMore = hasData && actions.length > maxDisplay;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// recent activity</p>
          <p className="uppercase">Actions</p>
        </div>
        {hasData && !hasMore && (
          <Link href="/app/dashboard/actions">
            <button className="p-1.5 bg-neutral-700 border border-neutral-600 transition-all duration-300 ease-out group hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
              <ArrowRight className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
            </button>
          </Link>
        )}
      </div>
      {hasData ? (
        <div className="w-full space-y-3 mt-4">
          {actions.slice(0, maxDisplay).map((action) => (
            <div
              key={action.id}
              className="p-3 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed text-white/90">
                    {action.description}
                  </p>
                  <p className="text-xs text-white/40 mt-1.5">
                    {formatTime(action.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/40">No activity yet</p>
          <p className="text-xs text-white/30 mt-1">Actions will appear here</p>
        </div>
      )}
      {hasMore && (
        <Link href="/app/dashboard/actions">
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

export default ActionsCard;
