import { StrategyDetail } from "@/lib/actions";
import { format } from "date-fns";

interface StrategyNameCardProps {
  strategy: StrategyDetail;
}

export default function StrategyNameCard({ strategy }: StrategyNameCardProps) {
  const createdDate = strategy.createdAt
    ? new Date(strategy.createdAt)
    : new Date();

  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6 h-full flex flex-col justify-between">
      <div>
        <p className="text-white/60 text-sm font-medium mb-3">Strategy Name</p>
        <h2 className="text-2xl font-bold text-white break-words">
          {strategy.name}
        </h2>
      </div>
      <div className="pt-4 border-t border-white/10">
        <p className="text-white/40 text-xs">
          Created {format(createdDate, "MMM d, yyyy")}
        </p>
      </div>
    </div>
  );
}
