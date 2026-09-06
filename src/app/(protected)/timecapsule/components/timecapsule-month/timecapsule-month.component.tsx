import type { TimeCapsuleMonth } from "../../types/timecapsule.types";
import { TimeCapsuleItem } from "../timecapsule-item/timecapsule-item.component";

interface TimeCapsuleMonthGroupProps {
  month: TimeCapsuleMonth;
  onOpen?: (id: string) => void;
}

export function TimeCapsuleMonthGroup({
  month,
  onOpen,
}: TimeCapsuleMonthGroupProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground capitalize">
        {month.label}
      </h2>
      <div className="space-y-3">
        {month.items.map((capsule) => (
          <TimeCapsuleItem key={capsule.id} capsule={capsule} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
