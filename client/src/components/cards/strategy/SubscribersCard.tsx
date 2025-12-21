"use client";

import { Users } from "lucide-react";

interface SubscribersCardProps {
  subscribers: Array<{ userWallet: string }>;
  totalCount: number;
}

export default function SubscribersCard({ subscribers, totalCount }: SubscribersCardProps) {
  const truncateWallet = (wallet: string) => {
    if (!wallet) return "Unknown";
    return `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
  };

  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6 h-full flex flex-col" >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white/60" />
          <p className="text-white/60 text-sm font-medium">Subscribers</p>
        </div>
      </div>

      {/* Subscriber Count Display */}
      <div className="mb-6 text-center">
        <p className="text-4xl font-bold text-white">{totalCount}</p>
        <p className="text-white/40 text-xs mt-2">
          {totalCount === 1 ? "subscriber" : "subscribers"}
        </p>
      </div>

      {/* Subscriber List */}
      <div className="space-y-2 flex-1">
        {subscribers.length === 0 ? (
          <div className="flex items-center justify-center min-h-32">
            <p className="text-white/40 text-sm text-center">No subscribers yet</p>
          </div>
        ) : (
          <>
            {subscribers.slice(0, 2).map((subscriber, index) => (
              <div
                key={`${subscriber.userWallet}-${index}`}
                className="bg-white/5 rounded border border-white/5 p-3 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-white/80 text-xs font-mono">
                    {truncateWallet(subscriber.userWallet)}
                  </p>
                  <div className="flex-shrink-0 w-2 h-2 bg-green-400/60 rounded-full"></div>
                </div>
              </div>
            ))}
            {subscribers.length > 2 && (
              <p className="text-white/40 text-xs text-center py-2">
                +{subscribers.length - 2} more
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-white/40 text-xs">Active subscribers</p>
      </div>
    </div>
  );
}
