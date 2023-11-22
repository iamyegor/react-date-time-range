import React from "react";
import { format, addDays, startOfWeek } from "date-fns";

interface DaysRowProps {
  currentMonth: Date;
}

function DaysRow({ currentMonth }: DaysRowProps) {
  const days = [];
  const startDate = startOfWeek(currentMonth);

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="flex-1" key={i}>
        {format(addDays(startDate, i), "iii")}
      </div>
    );
  }

  return <div className="flex bg-gray-200 text-gray-600 py-2">{days}</div>;
}

export default DaysRow;
