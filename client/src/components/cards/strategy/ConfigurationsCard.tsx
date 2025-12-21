import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface ConfigurationsCardProps {
  isActive: boolean;
  isPublic: boolean;
  onActiveChange: (value: boolean) => void;
  onPublicChange: (value: boolean) => void;
}

export default function ConfigurationsCard({
  isActive,
  isPublic,
  onActiveChange,
  onPublicChange,
}: ConfigurationsCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-card gradient-card-subtle backdrop-blur-sm p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-white/60" />
          <p className="text-white/60 text-sm font-medium">Configurations</p>
        </div>

        {/* Active Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/5 hover:border-white/10 transition-colors">
            <div>
              <p className="text-white font-semibold text-sm">Active</p>
              <p className="text-white/40 text-xs mt-1">
                {isActive ? "Strategy is active" : "Strategy is inactive"}
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={onActiveChange}
            />
          </div>
        </div>

        {/* Public Toggle */}
        <div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/5 hover:border-white/10 transition-colors">
            <div>
              <p className="text-white font-semibold text-sm">Public</p>
              <p className="text-white/40 text-xs mt-1">
                {isPublic ? "Visible to all users" : "Only for you"}
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={onPublicChange}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 mt-6">
        <p className="text-white/40 text-xs">Manage strategy visibility and status</p>
      </div>
    </div>
  );
}
