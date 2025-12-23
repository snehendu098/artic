import CardLayout from "@/components/layouts/card-layout";
import { Plus, Users, ArrowRight } from "lucide-react";
import { dummyStrategies } from "@/constants/data";

const StrategiesCard = () => {
  const maxDisplay = 3;
  const hasMore = dummyStrategies.length > maxDisplay;

  return (
    <CardLayout>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/50">// yield optimizers</p>
          <p className="uppercase">Strategies</p>
        </div>
        <button className="p-1.5 bg-neutral-700 border border-neutral-600 transition-all duration-300 ease-out group hover:scale-110 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">
          <Plus className="w-4 h-4 group-hover:text-primary transition-colors duration-300" />
        </button>
      </div>
      <div className="w-full space-y-3 mt-4">
        {dummyStrategies.slice(0, maxDisplay).map((strategy) => (
          <div
            key={strategy.id}
            className="p-3 bg-neutral-800 border border-neutral-700 hover:border-primary/50 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium group-hover:text-primary transition-colors truncate w-[70%]">
                {strategy.name}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Users className="w-3 h-3 text-white/50" />
                <span className="text-xs text-white/50">
                  {strategy.subscriberCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button className="w-full mt-3 py-2 bg-neutral-800 border border-neutral-700 hover:border-primary/50 hover:bg-neutral-750 transition-all duration-200 flex items-center justify-center gap-2 group">
          <span className="text-xs text-white/70 group-hover:text-primary transition-colors">
            View All
          </span>
          <ArrowRight className="w-3 h-3 text-white/70 group-hover:text-primary transition-colors" />
        </button>
      )}
    </CardLayout>
  );
};

export default StrategiesCard;
