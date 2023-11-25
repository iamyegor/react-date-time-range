import { format } from "date-fns";

interface HeaderProps {
  currentMonth: Date;
  onPrevMonthClick: () => void;
  onNextMonthClick: () => void;
}

export default function Header({
  currentMonth,
  onPrevMonthClick,
  onNextMonthClick,
}: HeaderProps) {
  const dateFormat = "MMMM yyyy";
  return (
    <div className="flex justify-between items-center py-2 px-4">
      <div
        className="cursor-pointer"
        onClick={onPrevMonthClick}
        data-testid="left-arrow"
      >
        &lt;
      </div>
      <div>
        <span>{format(currentMonth, dateFormat)}</span>
      </div>
      <div
        className="cursor-pointer"
        onClick={onNextMonthClick}
        data-testid="right-arrow"
      >
        &gt;
      </div>
    </div>
  );
}
