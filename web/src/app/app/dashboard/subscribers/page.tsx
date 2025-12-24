"use client";

import { dummySubscribers } from "@/constants/data";
import { useState } from "react";
import type { Subscriber } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import SubscriberRow from "@/components/subscribers/SubscriberRow";
import SubscriberDetailsPanel from "@/components/subscribers/SubscriberDetailsPanel";

const SubscribersPage = () => {
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
      <div className="w-full space-y-2">
        {dummySubscribers.map((subscriber) => (
          <SubscriberRow
            key={subscriber.id}
            subscriber={subscriber}
            formatDate={formatDate}
            onClick={() => setSelectedSubscriber(subscriber)}
            isSelected={selectedSubscriber?.id === subscriber.id}
          />
        ))}
      </div>
    </SplitPanelLayout>
  );
};

export default SubscribersPage;
