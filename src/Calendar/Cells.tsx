import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";

interface GetClassesForDayProps {
  day: Date;
  currentMonth: Date;
}

function getClassesForDay({
  day,
  currentMonth,
}: GetClassesForDayProps): string {
  const monthStart = startOfMonth(currentMonth);
  const dayIsSameMonth = isSameMonth(day, monthStart);
  const dayIsToday = isSameDay(day, new Date());

  if (!dayIsSameMonth) return "text-gray-400";
  if (dayIsToday) return "bg-blue-500 text-white rounded-full";
  return "text-gray-700";
}

interface CellsProps {
  currentMonth: Date;
}

export default function Cells({ currentMonth }: CellsProps) {
  const rows = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    let days = [];
    let day = startDate;

    const rows = [];
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        days.push(
          <div
            className="flex-1 py-1 flex justify-center items-center"
            key={day.toDateString()}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center  text-xs
              ${getClassesForDay({ day, currentMonth })}`}
            >
              <span>{formattedDate}</span>
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex" key={day.toDateString()}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  }, [currentMonth]);

  return <div className="flex-shrink-0 w-full">{rows}</div>;
}
