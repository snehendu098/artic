"use client";

import { dummyActions } from "@/constants/data";
import SplitPanelLayout from "@/components/layouts/split-panel-layout";
import ActionRow from "@/components/actions/ActionRow";

const ActionsPage = () => {
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

  return (
    <SplitPanelLayout
      backUrl="/app/dashboard"
      title="Actions"
      subtitle="// activity feed"
      isPanelOpen={false}
      sidePanel={null}
    >
      <div className="w-full space-y-2">
        {dummyActions.map((action) => (
          <ActionRow
            key={action.id}
            action={action}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        ))}
      </div>
    </SplitPanelLayout>
  );
};

export default ActionsPage;
