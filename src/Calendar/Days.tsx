import { addDays, format, startOfWeek } from "date-fns";
import { useMemo } from "react";

interface DaysProps {
  currentMonth: Date;
}

export default function Days({ currentMonth }: DaysProps) {
  const days = useMemo(() => {
    const dateFormat = "EEEEEE";
    const startDate = startOfWeek(currentMonth);
    return [...Array(7)].map((_, i) => (
      <div
        className="flex-1 py-2 text-center uppercase text-gray-500 text-xs"
        key={i}
      >
        {format(addDays(startDate, i), dateFormat)}
      </div>
    ));
  }, [currentMonth]);

  return <div className="flex">{days}</div>;
}