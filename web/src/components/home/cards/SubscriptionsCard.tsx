import CardLayout from "@/components/layouts/card-layout";
import { dummySubscriptions } from "@/constants/data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SubscriptionsCard = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const maxDisplay = 3;
  const hasMore = dummySubscriptions.length > maxDisplay;

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">// active subscriptions</p>
        <p className="uppercase">Subscriptions</p>
      </div>
      <div className="w-full space-y-3 mt-4">
        {dummySubscriptions.slice(0, maxDisplay).map((subscription) => (
          <div
            key={subscription.id}
            className="p-3 bg-neutral-800 border border-neutral-700 hover:border-primary/50 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0 w-[70%]">
                <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                  {subscription.strategyName}
                </p>
              </div>
              <span className="text-xs text-white/50 flex-shrink-0">
                {formatCurrency(subscription.currentValue)}
              </span>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <Link href="/app/dashboard/subscriptions">
          <button className="w-full mt-3 py-2 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 flex items-center justify-center gap-2 group">
            <span className="text-xs text-white/70 group-hover:text-primary transition-colors">
              View All
            </span>
            <ArrowRight className="w-3 h-3 text-white/70 group-hover:text-primary transition-colors" />
          </button>
        </Link>
      )}
    </CardLayout>
  );
};

export default SubscriptionsCard;
