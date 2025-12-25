"use client";

import Link from "next/link";
import { TrendingUp, Users, Plus, Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import Header from "@/components/common/Header";
import { motion } from "framer-motion";
import { useStrategies } from "@/hooks/useStrategies";

const StrategiesPage = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: strategies, isLoading } = useStrategies(walletAddress);

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
        <div className="w-full space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-white/50" />
            </div>
          ) : strategies.length === 0 ? (
            <div className="text-center py-12 text-sm text-white/50">
              No strategies yet. Create your first one!
            </div>
          ) : (
            strategies.map((strategy) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategiesPage;
