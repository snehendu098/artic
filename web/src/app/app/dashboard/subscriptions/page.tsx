"use client";

import { dummySubscriptions } from "@/constants/data";
import { useState } from "react";
import type { Subscription } from "@/types";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import SubscriptionRow from "@/components/subscriptions/SubscriptionRow";
import SubscriptionDetailsPanel from "@/components/subscriptions/SubscriptionDetailsPanel";

const SubscriptionsPage = () => {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

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
      title="Subscriptions"
      subtitle="// active subscriptions"
      isPanelOpen={!!selectedSubscription}
      sidePanel={
        selectedSubscription && (
          <SubscriptionDetailsPanel
            selectedSubscription={selectedSubscription}
            onClose={() => setSelectedSubscription(null)}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        )
      }
    >
      <div className="w-full space-y-2">
        {dummySubscriptions.map((subscription) => (
          <SubscriptionRow
            key={subscription.id}
            subscription={subscription}
            formatCurrency={formatCurrency}
            onClick={() => setSelectedSubscription(subscription)}
            isSelected={selectedSubscription?.id === subscription.id}
          />
        ))}
      </div>
    </SplitPanelLayout>
  );
};

export default SubscriptionsPage;
