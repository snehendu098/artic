import CardLayout from "@/components/layouts/card-layout";
import { dummyActions } from "@/constants/data";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Play,
  UserPlus,
  Plus,
  ArrowRight,
} from "lucide-react";

const ActionsCard = () => {
  const getActionIcon = (type: string) => {
    switch (type) {
      case "execution":
        return <Play className="w-3 h-3" />;
      case "subscription":
        return <UserPlus className="w-3 h-3" />;
      case "withdrawal":
        return <ArrowUpRight className="w-3 h-3" />;
      case "deposit":
        return <ArrowDownLeft className="w-3 h-3" />;
      case "strategy_created":
        return <Plus className="w-3 h-3" />;
      default:
        return <Play className="w-3 h-3" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case "execution":
        return "bg-blue-500/20 text-blue-400";
      case "subscription":
        return "bg-primary/20 text-primary";
      case "withdrawal":
        return "bg-red-500/20 text-red-400";
      case "deposit":
        return "bg-green-500/20 text-green-400";
      case "strategy_created":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-neutral-500/20 text-neutral-400";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours < 1) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const maxDisplay = 3;
  const hasMore = dummyActions.length > maxDisplay;

  return (
    <CardLayout>
      <div>
        <p className="text-xs text-white/50">// recent activity</p>
        <p className="uppercase">Actions</p>
      </div>
      <div className="w-full space-y-3 mt-4">
        {dummyActions.slice(0, maxDisplay).map((action) => (
          <div
            key={action.id}
            className="p-3 bg-neutral-800 border border-neutral-700 hover:border-neutral-600 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed text-white/90">
                  {action.description}
                </p>
                <p className="text-xs text-white/40 mt-1.5">
                  {formatTime(action.timestamp)}
                </p>
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

export default ActionsCard;
