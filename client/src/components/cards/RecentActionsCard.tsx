"use client";

import { useEffect, useState } from "react";
import WalletActionItem, { WalletActionItemProps } from "./WalletActionItem";
import { fetchRecentWalletActions } from "@/lib/actions";

interface RecentActionsCardProps {
  userWallet?: string;
}

const RecentActionsCard = ({ userWallet }: RecentActionsCardProps) => {
  const [actions, setActions] = useState<WalletActionItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userWallet) {
      setActions([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecentWalletActions(userWallet);
        setActions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch actions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userWallet]);

  if (error) {
    return (
      <div className="w-full border border-red-500/30 bg-card rounded-lg overflow-hidden">
        <div className="w-full px-4 py-3 border-b border-white/10">
          <p className="font-semibold">Recent Actions</p>
        </div>
        <div className="px-4 py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-white/10 bg-card gradient-card-subtle rounded-lg overflow-hidden">
      <div className="w-full px-4 py-3 border-b border-white/10">
        <p className="font-semibold">Recent Actions</p>
      </div>

      {loading ? (
        <div className="px-4 py-6">
          <p className="text-muted-foreground text-sm">Loading actions...</p>
        </div>
      ) : actions.length === 0 ? (
        <div className="px-4 py-6">
          <p className="text-muted-foreground text-sm">
            No recent actions yet. Your wallet interactions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {actions.map((action, index) => (
            <WalletActionItem
              key={index}
              action={action.action}
              stateChange={action.stateChange}
              strategyName={action.strategyName}
              createdAt={action.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActionsCard;
