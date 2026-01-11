"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendingUp, Users, Plus, Loader2, ShoppingBag } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import Header from "@/components/common/Header";
import { motion } from "framer-motion";
import { useStrategies, usePurchases } from "@/hooks";

type FilterType = "all" | "purchased" | "created";

const StrategiesPage = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: createdStrategies, isLoading: isLoadingCreated } =
    useStrategies(walletAddress);
  const { data: purchases, isLoading: isLoadingPurchases } =
    usePurchases(walletAddress);

  const [filter, setFilter] = useState<FilterType>("all");

  const isLoading = isLoadingCreated || isLoadingPurchases;

  const createdIds = new Set(createdStrategies.map((s) => s.id));

  const filteredCreated =
    filter === "purchased"
      ? []
      : createdStrategies;

  const filteredPurchases =
    filter === "created"
      ? []
      : purchases.filter((p) => !createdIds.has(p.strategyId));

  const hasNoData =
    filteredCreated.length === 0 && filteredPurchases.length === 0;

  const emptyMessage =
    filter === "all"
      ? "No strategies yet. Create your first one!"
      : filter === "purchased"
        ? "No purchased strategies"
        : "No created strategies";

  return (
    <div className="w-full flex items-center flex-col">
      <div className="w-full max-w-4xl space-y-2 ">
        <div className="flex items-center justify-between">
          <Header url="/app/strategies" />
          <Link href="/app/strategies/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 text-xs text-white/70 hover:text-primary whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Create Strategy</span>
            </motion.button>
          </Link>
        </div>

        <div className="flex items-center gap-1 p-1 bg-neutral-800 border border-neutral-700 w-fit">
          {(["all", "purchased", "created"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs capitalize transition-all duration-200 ${
                filter === f
                  ? "bg-primary text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="w-full space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-white/50" />
            </div>
          ) : hasNoData ? (
            <div className="text-center py-12 text-sm text-white/50">
              {emptyMessage}
            </div>
          ) : (
            <>
              {filteredCreated.map((strategy) => (
                <Link
                  key={strategy.id}
                  href={`/app/strategies/${strategy.id}`}
                >
                  <div className="p-3 bg-neutral-900 mb-2 border border-neutral-700 hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-neutral-700">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                              {strategy.name}
                            </p>
                            <span className="text-[10px] px-1.5 py-0.5 bg-neutral-700 text-white/50">
                              Created
                            </span>
                          </div>
                          <p className="text-xs text-white/40 mt-0.5">
                            {strategy.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-3">
                        <div className="flex items-center gap-1 shrink-0">
                          <Users className="w-3 h-3 text-white/50" />
                          <span className="text-xs text-white/50">
                            {strategy.subscriberCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {filteredPurchases.map((purchase) => (
                <Link
                  key={purchase.id}
                  href={`/app/strategies/${purchase.strategyId}`}
                >
                  <div className="p-3 bg-neutral-900 mb-2 border border-neutral-700 hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-neutral-700">
                          <ShoppingBag className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                              {purchase.strategyName}
                            </p>
                            <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary">
                              Purchased
                            </span>
                          </div>
                          <p className="text-xs text-white/40 mt-0.5">
                            {parseFloat(purchase.priceMnt)} MNT
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategiesPage;
