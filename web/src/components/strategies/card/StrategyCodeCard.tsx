"use client";

import CardLayout from "@/components/layouts/card-layout";

interface StrategyCodeCardProps {
  code: string;
}

const StrategyCodeCard = ({ code }: StrategyCodeCardProps) => {
  return (
    <CardLayout>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white/50 uppercase">
            Strategy Steps
          </label>
        </div>
        <div className="bg-neutral-800 border border-neutral-700">
          <div className="p-3 border-b border-neutral-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
            <span className="text-xs text-white/30 ml-2">strategy.md</span>
          </div>
          <pre className="px-4 py-3 text-sm font-mono text-white/90 whitespace-pre-wrap overflow-x-auto">
            {code}
          </pre>
        </div>
      </div>
    </CardLayout>
  );
};

export default StrategyCodeCard;
