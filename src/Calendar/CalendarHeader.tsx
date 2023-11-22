import React from 'react';
import { format } from 'date-fns';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonthClick: () => void;
  onNextMonthClick: () => void;
}

function CalendarHeader({ currentMonth, onPrevMonthClick, onNextMonthClick }: CalendarHeaderProps) {
  const dateFormat = "MMMM yyyy";
  return (
    <div className="flex justify-between items-center py-2 bg-gray-100 text-gray-700">
      <button 
        onClick={onPrevMonthClick}
        className="cursor-pointer p-2"
      >
        &lt;
      </button>
      <span>{format(currentMonth, dateFormat)}</span>
      <button 
        onClick={onNextMonthClick}
        className="cursor-pointer p-2"
      >
        &gt;
      </button>
    </div>
  );
}

export default CalendarHeader;
