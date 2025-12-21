import { TrendingUp } from "lucide-react";

export default function WalletPortfolioCard() {
  // Hardcoded chart data - will be configurable later
  const chartData = [
    { name: "Token A", value: 45, color: "#c95830" },
    { name: "Token B", value: 25, color: "#BE502C" },
    { name: "Token C", value: 20, color: "#A83D1F" },
    { name: "Token D", value: 10, color: "#8A3018" },
  ];

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-white/60 text-sm font-medium">Wallet Portfolio</p>
          <p className="text-2xl font-bold text-white mt-2">$12,450.50</p>
        </div>
        <TrendingUp className="w-5 h-5 text-green-400" />
      </div>

      {/* Placeholder Chart Area */}
      <div className="bg-white/5 rounded border border-white/5 p-8 mb-6 flex items-center justify-center min-h-64">
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">Portfolio Distribution</p>
          <div className="inline-flex items-center gap-6">
            {chartData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-2" style={{
                  background: `conic-gradient(${item.color} 0deg, ${item.color} ${(item.value / totalValue) * 360}deg, transparent ${(item.value / totalValue) * 360}deg)`
                }}></div>
                <p className="text-white/60 text-xs">{item.name}</p>
                <p className="text-white font-semibold text-sm">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="grid grid-cols-2 gap-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-white/60 text-xs">{item.name}</span>
            <span className="text-white font-semibold text-xs ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
