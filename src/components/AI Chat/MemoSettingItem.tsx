import React from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  locked?: boolean;
  isPremiumFeature?: boolean;
  icon?: React.ReactNode;
}

function SettingItem({
  title,
  description,
  checked,
  onCheckedChange,
  locked,
  isPremiumFeature,
  icon
}: Props) {
  return (
    <div
      className={cn(
        "p-3 rounded-lg border flex justify-between items-center",
        locked
          ? "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
          : "border-transparent"
      )}
    >
      <div className="flex gap-3 flex-1">
        {icon && <div className="text-emerald-500 mt-0.5">{icon}</div>}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                locked
                  ? "text-slate-400 dark:text-slate-500"
                  : "text-slate-700 dark:text-slate-300"
              )}
            >
              {title}
            </span>

            {isPremiumFeature && (
              <Badge
                variant="outline"
                className="text-xs flex items-center gap-1 border-amber-300 text-amber-600"
              >
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            )}
          </div>

          <p
            className={cn(
              "text-xs mt-1",
              locked
                ? "text-slate-400 dark:text-slate-500"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            {description}
          </p>
        </div>
      </div>

      <Switch
        checked={checked}
        disabled={locked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

const MemoSettingItem = React.memo(SettingItem);
export { MemoSettingItem };
export default MemoSettingItem;
