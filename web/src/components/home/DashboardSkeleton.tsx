"use client";

import CardLayout from "@/components/layouts/card-layout";

const OverviewSkeleton = () => (
  <CardLayout>
    <div>
      <p className="text-xs text-white/50">// account</p>
      <p className="uppercase">Overview</p>
    </div>
    <div className="w-full grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-full bg-neutral-800 relative p-4 border border-neutral-700">
          <div className="h-3 bg-neutral-700 animate-pulse w-16 mb-2" />
          <div className="h-7 bg-neutral-700 animate-pulse w-20" />
        </div>
      ))}
    </div>
  </CardLayout>
);

const AssetsSkeleton = () => (
  <CardLayout>
    <div>
      <p className="text-xs text-white/50">// combined assets</p>
      <p className="uppercase">Assets</p>
    </div>
    <div className="w-full space-y-2 mt-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-700 animate-pulse" />
              <div>
                <div className="h-4 bg-neutral-700 animate-pulse w-12 mb-1" />
                <div className="h-3 bg-neutral-700 animate-pulse w-20" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-neutral-700 animate-pulse w-16 mb-1" />
              <div className="h-3 bg-neutral-700 animate-pulse w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardLayout>
);

const SmallCardSkeleton = ({ label }: { label: string }) => (
  <CardLayout>
    <div>
      <p className="text-xs text-white/50">// {label}</p>
      <p className="uppercase">{label}</p>
    </div>
    <div className="w-full space-y-2 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-center justify-between gap-2">
            <div className="h-4 bg-neutral-700 animate-pulse w-[50%]" />
            <div className="h-5 bg-neutral-700 animate-pulse w-14" />
          </div>
        </div>
      ))}
    </div>
  </CardLayout>
);

const WalletsSkeleton = () => (
  <CardLayout>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-white/50">// wallets</p>
        <p className="uppercase">Wallets</p>
      </div>
      <div className="w-8 h-8 bg-neutral-700 animate-pulse" />
    </div>
    <div className="w-full space-y-3 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-neutral-700 animate-pulse" />
              <div>
                <div className="h-4 bg-neutral-700 animate-pulse w-24 mb-1" />
                <div className="h-3 bg-neutral-700 animate-pulse w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardLayout>
);

const StrategiesSkeleton = () => (
  <CardLayout>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-white/50">// yield optimizers</p>
        <p className="uppercase">Strategies</p>
      </div>
      <div className="w-8 h-8 bg-neutral-700 animate-pulse" />
    </div>
    <div className="w-full space-y-3 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-3 bg-neutral-800 border border-neutral-700">
          <div className="flex items-center justify-between gap-3">
            <div className="h-4 bg-neutral-700 animate-pulse w-[60%]" />
            <div className="h-3 bg-neutral-700 animate-pulse w-8" />
          </div>
        </div>
      ))}
    </div>
  </CardLayout>
);

const DashboardSkeleton = () => {
  return (
    <div className="w-full grid gap-4 grid-cols-6">
      <div className="col-span-4 space-y-4">
        <OverviewSkeleton />
        <AssetsSkeleton />
        <div className="w-full grid grid-cols-2 gap-4">
          <SmallCardSkeleton label="subscriptions" />
          <SmallCardSkeleton label="subscribers" />
        </div>
      </div>
      <div className="col-span-2 space-y-4">
        <WalletsSkeleton />
        <StrategiesSkeleton />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
