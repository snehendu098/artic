"use client";

import { WalletAction } from "@/lib/actions";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Activity } from "lucide-react";

interface WalletActionsCardProps {
  actions: WalletAction[];
}

export default function WalletActionsCard({ actions }: WalletActionsCardProps) {
  const halfPoint = Math.ceil(actions.length / 2);
  const leftActions = actions.slice(0, halfPoint);
  const rightActions = actions.slice(halfPoint);

  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6" >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-white/60" />
        <p className="text-white/60 text-sm font-medium">Wallet Actions</p>
      </div>

      {actions.length === 0 ? (
        <div className="flex items-center justify-center min-h-64">
          <p className="text-white/40 text-sm text-center">No actions yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-2">
            {leftActions.map((action, index) => (
              <div
                key={action.id}
                className="bg-white/5 rounded border border-white/5 p-3 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {action.emoji && <span className="text-lg">{action.emoji}</span>}
                      <p className="text-white/90 text-sm font-medium truncate">
                        {action.action}
                      </p>
                    </div>
                    {action.stateChange && (
                      <p className="text-white/50 text-xs mt-1">
                        {action.stateChange}
                      </p>
                    )}
                    <p className="text-white/30 text-xs mt-1">
                      {formatDistanceToNow(new Date(action.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {rightActions.map((action, index) => (
              <div
                key={action.id}
                className="bg-white/5 rounded border border-white/5 p-3 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {action.emoji && <span className="text-lg">{action.emoji}</span>}
                      <p className="text-white/90 text-sm font-medium truncate">
                        {action.action}
                      </p>
                    </div>
                    {action.stateChange && (
                      <p className="text-white/50 text-xs mt-1">
                        {action.stateChange}
                      </p>
                    )}
                    <p className="text-white/30 text-xs mt-1">
                      {formatDistanceToNow(new Date(action.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-white/40 text-xs">
          {actions.length} action{actions.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
