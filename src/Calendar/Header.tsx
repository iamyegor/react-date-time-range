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
      <div className="cursor-pointer" onClick={onPrevMonthClick}>
        &lt;
      </div>
      <div>
        <span>{format(currentMonth, dateFormat)}</span>
      </div>
      <div className="cursor-pointer" onClick={onNextMonthClick}>
        &gt;
      </div>
    </div>
  );
}
