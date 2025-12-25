"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSubscriptions } from "@/hooks";
import type { Subscription } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import SubscriptionRow from "@/components/subscriptions/SubscriptionRow";
import SubscriptionDetailsPanel from "@/components/subscriptions/SubscriptionDetailsPanel";

const SubscriptionsPageSkeleton = () => (
  <SplitPanelLayout
    backUrl="/app/dashboard"
    title="Subscriptions"
    subtitle="// active subscriptions"
    isPanelOpen={false}
    sidePanel={null}
  >
    <div className="w-full space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-neutral-800 border border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-neutral-700 animate-pulse w-[40%]" />
            <div className="h-5 bg-neutral-700 animate-pulse w-16" />
          </div>
        </div>
      ))}
    </div>
  </SplitPanelLayout>
);

const SubscriptionsPage = () => {
  const { user } = usePrivy();
  const { data: subscriptions, isLoading } = useSubscriptions(user?.wallet?.address);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) return <SubscriptionsPageSkeleton />;

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Subscriptions"
      subtitle="// active subscriptions"
      isPanelOpen={!!selectedSubscription}
      sidePanel={
        selectedSubscription && (
          <SubscriptionDetailsPanel
            selectedSubscription={selectedSubscription}
            onClose={() => setSelectedSubscription(null)}
            formatDate={formatDate}
          />
        )
      }
    >
      {subscriptions.length > 0 ? (
        <div className="w-full space-y-2">
          {subscriptions.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              onClick={() => setSelectedSubscription(subscription)}
              isSelected={selectedSubscription?.id === subscription.id}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/40">No subscriptions yet</p>
          <p className="text-xs text-white/30 mt-1">Subscribe to strategies to see them here</p>
        </div>
      )}
    </SplitPanelLayout>
  );
};

export default SubscriptionsPage;
