import { format } from "date-fns";
import leftArrowSvg from "../assets/icons/left-arrow.svg";
import rightArrowSvg from "../assets/icons/right-arrow.svg";

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
        data-testid="prev-month-button"
      >
        <img src={leftArrowSvg} alt="left-arrow" className="w-5 h-5" />
      </div>
      <div>
        <span>{format(currentMonth, dateFormat)}</span>
      </div>
      <div
        className="cursor-pointer"
        onClick={onNextMonthClick}
        data-testid="next-month-button"
      >
        <img
          src={rightArrowSvg}
          alt="right-arrow"
          className="w-5 h-5"
        />
      </div>
    </div>
  );
}
