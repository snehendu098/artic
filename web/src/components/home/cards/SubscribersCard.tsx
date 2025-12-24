import CardLayout from "@/components/layouts/card-layout";
import { dummySubscribers } from "@/constants/data";
import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const SubscribersCard = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const maxDisplay = 3;
  const hasMore = dummySubscribers.length > maxDisplay;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// subscribers</p>
          <p className="uppercase">Subscribers</p>
        </div>
      </div>
      <div className="w-full space-y-2 mt-4">
        {dummySubscribers.slice(0, maxDisplay).map((subscriber) => (
          <div
            key={subscriber.id}
            className="p-2.5 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-neutral-700 flex items-center justify-center">
                  <Users className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium">{subscriber.username}</p>
                  <p className="text-xs text-white/40">
                    {formatDate(subscriber.subscribedAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 truncate max-w-[100px]">
                  {subscriber.strategyName}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <Link href="/app/dashboard/subscribers">
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

export default SubscribersCard;
