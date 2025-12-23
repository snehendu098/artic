import CardLayout from "@/components/layouts/card-layout";
import { dummyOverviewStats } from "@/constants/data";

const SubCard = ({
  heading,
  main,
  incrementor,
}: {
  heading: string;
  main: string;
  incrementor?: string;
}) => (
  <div className="w-full bg-neutral-800 relative p-4 border border-neutral-700 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-neutral-750 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] cursor-pointer">
    <p className="uppercase text-xs text-white/50">{heading}</p>
    <p className="text-xl mt-2 font-semibold">{main}</p>
    {incrementor && (
      <p
        className={`text-xs bottom-2 right-2 absolute font-medium ${
          incrementor.startsWith("+") ? "text-primary" : "text-red-400"
        }`}
      >
        {incrementor}
      </p>
    )}
  </div>
);

const OverviewCard = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatChange = (value: number) => {
    return value > 0 ? `+${value}` : `-${value}`;
  };

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">// account</p>
        <p className="uppercase">Overview</p>
      </div>
      <div className="w-full grid grid-cols-4 gap-4">
        <SubCard
          heading="Total Amount"
          main={formatCurrency(dummyOverviewStats.totalAmountUSD)}
          incrementor={`${formatChange(dummyOverviewStats.totalAmountChange)}%`}
        />
        <SubCard
          heading="Strategies"
          main={dummyOverviewStats.totalStrategies.toString()}
          incrementor={formatChange(dummyOverviewStats.strategiesChange)}
        />
        <SubCard
          heading="Wallets"
          main={dummyOverviewStats.totalWallets.toString()}
          incrementor={formatChange(dummyOverviewStats.walletsChange)}
        />
        <SubCard
          heading="Subscribers"
          main={dummyOverviewStats.totalSubscribers.toString()}
          incrementor={formatChange(dummyOverviewStats.subscribersChange)}
        />
      </div>
    </CardLayout>
  );
};

export default OverviewCard;
