import CardLayout from "@/components/layouts/card-layout";
import { Wallet, ArrowRight } from "lucide-react";
import { dummyWallets } from "@/constants/data";
import CreateWalletDialog from "@/components/dialog/CreateWalletDialog";
import Link from "next/link";

const WalletsCard = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const maxDisplay = 3;
  const hasMore = dummyWallets.length > maxDisplay;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// wallets</p>
          <p className="uppercase">Wallets</p>
        </div>
        <CreateWalletDialog mode="icon" />
      </div>
      <div className="w-full space-y-3 mt-4">
        {dummyWallets.slice(0, maxDisplay).map((wallet) => (
          <div
            key={wallet.id}
            className="p-3 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-neutral-700 group-hover:bg-neutral-600 transition-colors">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{wallet.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {shortenAddress(wallet.address)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {formatCurrency(wallet.balanceUSD)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <Link href="/app/dashboard/wallets">
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

export default WalletsCard;
