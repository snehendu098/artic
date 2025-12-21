import { StrategyDetail } from "@/lib/actions";
import { Switch } from "@/components/ui/switch";

interface StrategyStatusCardProps {
  isActive: boolean;
  isPublic: boolean;
  onActiveChange: (value: boolean) => void;
  onPublicChange: (value: boolean) => void;
  strategy: StrategyDetail;
}

export default function StrategyStatusCard({
  isActive,
  isPublic,
  onActiveChange,
  onPublicChange,
  strategy,
}: StrategyStatusCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6 h-full flex flex-col justify-between">
      <div>
        <p className="text-white/60 text-sm font-medium mb-6">Status Settings</p>

        {/* Active Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-white text-sm font-medium">Active</p>
            <Switch
              checked={isActive}
              onCheckedChange={onActiveChange}
            />
          </div>
        </div>

        {/* Public Status */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <p className="text-white text-sm font-medium">Public</p>
            <Switch
              checked={isPublic}
              onCheckedChange={onPublicChange}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-white/40 text-xs">Edit strategy visibility and status</p>
      </div>
    </div>
  );
}
