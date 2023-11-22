import { format } from "date-fns";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonthClick: () => void;
  onNextMonthClick: () => void;
}

function CalendarHeader({
  currentMonth,
  onPrevMonthClick,
  onNextMonthClick,
}: CalendarHeaderProps) {
  const dateFormat = "MMMM yyyy";
  return (
    <div className="header row flex-middle">
      <div className="col col-start">
        <div className="icon" onClick={onPrevMonthClick}>
          chevron_left
        </div>
      </div>
      <div className="col col-center">
        <span>{format(currentMonth, dateFormat)}</span>
      </div>
      <div className="col col-end" onClick={onNextMonthClick}>
        <div className="icon">chevron_right</div>
      </div>
    </div>
  );
}

export default CalendarHeader;
