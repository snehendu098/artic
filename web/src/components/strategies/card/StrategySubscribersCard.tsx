"use client";

import CardLayout from "@/components/layouts/card-layout";
import type { Subscriber } from "@/types";

interface StrategySubscribersCardProps {
  subscribers: Subscriber[];
}

const StrategySubscribersCard = ({
  subscribers,
}: StrategySubscribersCardProps) => {
  if (subscribers.length === 0) return null;

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">
          // subscribers ({subscribers.length})
        </p>
        <p className="mb-3 uppercase">Subscribers</p>
      </div>
      <div className="space-y-2">
        {subscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className="flex items-center justify-between p-2.5 bg-neutral-800 border border-neutral-700"
          >
            <div>
              <p className="text-xs font-medium">{subscriber.username}</p>
            </div>
            <p className="text-xs font-semibold text-white/60">
              {new Date(subscriber.subscribedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </CardLayout>
  );
};

export default StrategySubscribersCard;
