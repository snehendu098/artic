"use client";

import { usePrivy } from "@privy-io/react-auth";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import ActionRow from "@/components/actions/ActionRow";
import { useActions } from "@/hooks";

const ActionsPage = () => {
  const { authenticated, user } = usePrivy();
  const walletAddress = user?.wallet?.address;
  const { data: actions, isLoading } = useActions(walletAddress, 50);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!authenticated) {
    return (
      <SplitPanelLayout
        backUrl="/app/dashboard"
        title="Actions"
        subtitle="// activity feed"
        isPanelOpen={false}
        sidePanel={null}
      >
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-white/50">Connect wallet to view actions</p>
        </div>
      </SplitPanelLayout>
    );
  }

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Actions"
      subtitle="// activity feed"
      isPanelOpen={false}
      sidePanel={null}
    >
      <div className="w-full space-y-2">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3 bg-neutral-900 border border-neutral-700 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-neutral-700 w-full mb-2" />
                  <div className="h-3 bg-neutral-700 w-24" />
                </div>
              </div>
            </div>
          ))
        ) : actions.length > 0 ? (
          actions.map((action) => (
            <ActionRow
              key={action.id}
              action={action}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div className="p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-white/40">No actions yet</p>
            <p className="text-xs text-white/30 mt-1">Activity will appear here</p>
          </div>
        )}
      </div>
    </SplitPanelLayout>
  );
};

export default ActionsPage;
