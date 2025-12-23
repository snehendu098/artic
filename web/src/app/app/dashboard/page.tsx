import Header from "@/components/common/Header";
import OverviewCard from "@/components/home/cards/OverviewCard";
import StrategiesCard from "@/components/home/cards/StrategiesCard";
import CombinedAssetCard from "@/components/home/cards/CombinedAssetCard";
import SubscriptionsCard from "@/components/home/cards/SubscriptionsCard";
import WalletsCard from "@/components/home/cards/WalletsCard";
import ActionsCard from "@/components/home/cards/ActionsCard";
import SubscribersCard from "@/components/home/cards/SubscribersCard";

const Page = () => {
  return (
    <div className="w-full">
      <Header url="/app/dashboard" />
      <div className="mt-6 w-full grid gap-4 grid-cols-6">
        <div className="col-span-4 space-y-4">
          <OverviewCard />
          {/* Grid for strategies and wallets */}
          <div className="w-full">
            <CombinedAssetCard />
          </div>
          <div className="w-full space-x-4 grid grid-cols-2 gap-4">
            <SubscriptionsCard />

            <SubscribersCard />
          </div>
        </div>
        <div className="col-span-2 space-y-4">
          <WalletsCard />

          <StrategiesCard />
          <ActionsCard />
        </div>
      </div>
    </div>
  );
};

export default Page;
