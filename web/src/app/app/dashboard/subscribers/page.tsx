"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useSubscribers } from "@/hooks";
import type { Subscriber } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import SubscriberRow from "@/components/subscribers/SubscriberRow";
import SubscriberDetailsPanel from "@/components/subscribers/SubscriberDetailsPanel";

const SubscribersPageSkeleton = () => (
  <SplitPanelLayout
    backUrl="/app/dashboard"
    title="Subscribers"
    subtitle="// strategy subscribers"
    isPanelOpen={false}
    sidePanel={null}
  >
    <div className="w-full space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 bg-neutral-800 border border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-neutral-700 animate-pulse" />
              <div className="h-4 bg-neutral-700 animate-pulse w-24" />
            </div>
            <div className="h-4 bg-neutral-700 animate-pulse w-20" />
          </div>
        </div>
      ))}
    </div>
  </SplitPanelLayout>
);

const SubscribersPage = () => {
  const { user } = usePrivy();
  const { data: subscribers, isLoading } = useSubscribers(user?.wallet?.address);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) return <SubscribersPageSkeleton />;

  const filteredSubscribers = subscribers.filter(s => s.wallet !== user?.wallet?.address);

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Subscribers"
      subtitle="// strategy subscribers"
      isPanelOpen={!!selectedSubscriber}
      sidePanel={
        selectedSubscriber && (
          <SubscriberDetailsPanel
            selectedSubscriber={selectedSubscriber}
            onClose={() => setSelectedSubscriber(null)}
            formatDate={formatDate}
          />
        )
      }
    >
      {filteredSubscribers.length > 0 ? (
        <div className="w-full space-y-2">
          {filteredSubscribers.map((subscriber) => (
            <SubscriberRow
              key={subscriber.id}
              subscriber={subscriber}
              formatDate={formatDate}
              onClick={() => setSelectedSubscriber(subscriber)}
              isSelected={selectedSubscriber?.id === subscriber.id}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 border border-dashed border-neutral-700 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-white/40">No subscribers yet</p>
          <p className="text-xs text-white/30 mt-1">Make your strategies public to get subscribers</p>
        </div>
      )}
    </SplitPanelLayout>
  );
};

export default SubscribersPage;
