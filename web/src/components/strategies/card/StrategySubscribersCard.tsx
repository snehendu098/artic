"use client";

import CardLayout from "@/components/layouts/card-layout";
import type { Subscriber } from "@/types";

interface StrategySubscribersCardProps {
  subscribers: Subscriber[];
  isCreator: boolean;
  currentUserWallet?: string;
}

const shortenAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const StrategySubscribersCard = ({
  subscribers,
  isCreator,
  currentUserWallet,
}: StrategySubscribersCardProps) => {
  const filteredSubscribers = subscribers.filter(
    (s) => s.wallet.toLowerCase() !== currentUserWallet?.toLowerCase()
  );

  if (!isCreator || filteredSubscribers.length === 0) return null;

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">
          // subscribers ({filteredSubscribers.length})
        </p>
        <p className="mb-3 uppercase">Subscribers</p>
      </div>
      <div className="space-y-2">
        {filteredSubscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className="flex items-center justify-between p-2.5 bg-neutral-800 border border-neutral-700"
          >
            <div>
              <p className="text-xs font-medium">
                {subscriber.username || shortenAddress(subscriber.wallet)}
              </p>
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
