"use client";

import { dummyStrategies } from "@/constants/data";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import Link from "next/link";
import { TrendingUp, Users } from "lucide-react";
import Header from "@/components/common/Header";

const StrategiesPage = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="w-full flex items-center flex-col">
      <div className="w-full max-w-4xl space-y-2 ">
        <Header url="/app/strategies" />
        <div className="w-full space-y-2">
          {dummyStrategies.map((strategy) => (
            <Link key={strategy.id} href={`/app/strategies/${strategy.id}`}>
              <div className="p-3 bg-neutral-900 mb-2 border border-neutral-700 hover:border-primary/50 transition-all duration-200 cursor-pointer group">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-neutral-700">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                        {strategy.name}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5 truncate">
                        {strategy.description}
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
        </div>
      </div>
    </div>
  );
};

export default StrategiesPage;
