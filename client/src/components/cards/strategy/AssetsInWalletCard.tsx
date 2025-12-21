import { Wallet } from "lucide-react";

export default function AssetsInWalletCard() {
  // Hardcoded assets data
  const assets = [
    {
      name: "Ethereum",
      symbol: "ETH",
      amount: 2.5,
      value: "$4,750.00",
      change: "+5.2%",
    },
    {
      name: "USDC",
      symbol: "USDC",
      amount: 5000,
      value: "$5,000.00",
      change: "+0.1%",
    },
    {
      name: "Mantle",
      symbol: "MNT",
      amount: 1000,
      value: "$2,500.00",
      change: "-2.3%",
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      amount: 0.25,
      value: "$10,250.00",
      change: "+3.7%",
    },
  ];

  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-5 h-5 text-white/60" />
        <p className="text-white/60 text-sm font-medium">Assets in Wallet</p>
      </div>

      {/* Two Column Asset Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          {assets.slice(0, 2).map((asset, index) => (
            <div
              key={index}
              className="bg-white/5 rounded border border-white/5 p-4 hover:border-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-semibold text-sm">{asset.name}</p>
                  <p className="text-white/40 text-xs">{asset.symbol}</p>
                </div>
                <span className={`text-xs font-semibold ${
                  asset.change.startsWith("+")
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {asset.change}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/80 text-sm font-mono">{asset.amount}</p>
                </div>
                <p className="text-white font-semibold text-sm">{asset.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {assets.slice(2, 4).map((asset, index) => (
            <div
              key={index}
              className="bg-white/5 rounded border border-white/5 p-4 hover:border-white/10 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-semibold text-sm">{asset.name}</p>
                  <p className="text-white/40 text-xs">{asset.symbol}</p>
                </div>
                <span className={`text-xs font-semibold ${
                  asset.change.startsWith("+")
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                  {asset.change}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/80 text-sm font-mono">{asset.amount}</p>
                </div>
                <p className="text-white font-semibold text-sm">{asset.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Assets */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between items-center">
          <p className="text-white/60 text-sm">Total Assets Value</p>
          <p className="text-white font-bold text-lg">$22,500.00</p>
        </div>
      </div>
    </div>
  );
}
