"use client";

import CardLayout from "@/components/layouts/card-layout";
import { Plus, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDashboardData } from "@/contexts/DashboardDataContext";

const StrategiesCardSkeleton = () => (
  <CardLayout>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-white/50">// yield optimizers</p>
        <p className="uppercase">Strategies</p>
      </div>
      <div className="w-8 h-8 bg-neutral-700 animate-pulse" />
    </div>
    <div className="w-full space-y-3 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 bg-neutral-700 animate-pulse w-[60%]" />
            <div className="h-3 bg-neutral-700 animate-pulse w-8" />
          </div>
        </div>
      ))}
    </div>
  </CardLayout>
);

const StrategiesCard = () => {
  const { data, loading } = useDashboardData();
  const { strategies: created, purchases } = data;
  const isLoading = loading.strategies || loading.purchases;

  const purchasedAsStrategies = purchases.map(p => ({
    id: p.strategyId,
    name: p.strategyName,
    subscriberCount: 0,
    status: "active" as const,
    createdAt: p.purchasedAt,
    protocols: [] as string[],
  }));
  const strategies = [...created, ...purchasedAsStrategies];

  if (isLoading) return <StrategiesCardSkeleton />;

  const hasData = strategies && strategies.length > 0;
  const maxDisplay = 3;
  const hasMore = hasData && strategies.length > maxDisplay;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// yield optimizers</p>
          <p className="uppercase">Strategies</p>
        </div>
        <Link href="/app/strategies/create">
          <button className="p-1.5 bg-neutral-700 border border-neutral-600 transition-all duration-300 ease-out group hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
            <Plus className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
          </button>
        </Link>
      </div>
      {hasData ? (
        <div className="w-full space-y-3 mt-4">
          {strategies.slice(0, maxDisplay).map((strategy) => (
            <Link key={strategy.id} href={`/app/strategies/${strategy.id}`}>
              <div className="p-3 bg-neutral-800 border border-neutral-700 mb-2 hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors truncate w-[70%]">
                    {strategy.name}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Users className="w-3 h-3 text-white/50" />
                    <span className="text-xs text-white/50">
                      {strategy.subscriberCount}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-4 p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/40">No strategies yet</p>
          <Link href="/app/strategies/create" className="text-xs text-primary mt-1 hover:underline">
            Create your first strategy
          </Link>
        </div>
      )}
      {hasMore && (
        <Link href="/app/strategies">
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

export default StrategiesCard;
