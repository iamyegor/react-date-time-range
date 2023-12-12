import { format, isSameMonth } from "date-fns";
import leftArrowSvg from "../assets/icons/left-arrow.svg";
import rightArrowSvg from "../assets/icons/right-arrow.svg";
import { useDateTimeRange } from "./DateTimeRangeProvider";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import LeftArrow from "./LeftArrow";

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
  const [leftArrowDisabled, setLeftArrowDisabled] = useState<boolean>(false);
  const { minDate } = useDateTimeRange();

  useEffect(() => {
    if (minDate && isSameMonth(currentMonth, minDate)) {
      setLeftArrowDisabled(true);
    } else {
      setLeftArrowDisabled(false);
    }
  }, [currentMonth, minDate]);

  const dateFormat = "MMMM yyyy";
  return (
    <div className="flex justify-between items-center py-2 px-4">
      <button
        className="cursor-pointer"
        onClick={onPrevMonthClick}
        data-testid="prev-month-button"
        disabled={leftArrowDisabled}
        style={{
          filter: leftArrowDisabled ? "grayscale(100%)" : "grayscale(0%)",
        }}
      >
        <LeftArrow isDisabled={leftArrowDisabled} />
        {/* <img src={leftArrowSvg} alt="left-arrow" className="w-5 h-5 text-gray-10" /> */}
        {/* <ReactSVG src={leftArrowSvg} width={20} height={20} color="gray" /> */}
      </button>
      <div>
        <span>{format(currentMonth, dateFormat)}</span>
      </div>
      <div
        className="cursor-pointer"
        onClick={onNextMonthClick}
        data-testid="next-month-button"
      >
        <img src={rightArrowSvg} alt="right-arrow" className="w-5 h-5" />
      </div>
    </div>
  );
}
