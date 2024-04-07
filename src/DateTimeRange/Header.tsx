import { format, isSameMonth } from "date-fns";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks.ts";
import { selectMaxDate, selectMinDate } from "../redux/dateTimeRangeSlice.ts";
import LeftArrow from "./arrows/LeftArrow.tsx";
import RightArrow from "./arrows/RightArrow.tsx";

interface HeaderProps {
    currentMonth: Date;
    onPrevMonthClick: () => void;
    onNextMonthClick: () => void;
}

export default function Header({ currentMonth, onPrevMonthClick, onNextMonthClick }: HeaderProps) {
    const [leftArrowDisabled, setLeftArrowDisabled] = useState<boolean>(false);
    const [rightArrowDisabled, setRightArrowDisabled] = useState<boolean>(false);
    const minDate = useAppSelector(selectMinDate);
    const maxDate = useAppSelector(selectMaxDate);

    useEffect(() => {
        if (minDate && isSameMonth(currentMonth, minDate)) {
            setLeftArrowDisabled(true);
        } else {
            setLeftArrowDisabled(false);
        }
    }, [currentMonth, minDate]);

    useEffect(() => {
        if (maxDate && isSameMonth(currentMonth, maxDate)) {
            setRightArrowDisabled(true);
        } else {
            setRightArrowDisabled(false);
        }
    }, [currentMonth, maxDate]);

    const dateFormat = "MMMM yyyy";
    return (
        <div className="flex justify-between items-center py-2 px-4">
            <button
                className="cursor-pointer"
                onClick={onPrevMonthClick}
                data-testid="prev-month-button"
                disabled={leftArrowDisabled}
            >
                <LeftArrow isDisabled={leftArrowDisabled} />
            </button>
            <div>
                <span>{format(currentMonth, dateFormat)}</span>
            </div>
            <button
                className="cursor-pointer"
                onClick={onNextMonthClick}
                data-testid="next-month-button"
                disabled={rightArrowDisabled}
            >
                <RightArrow isDisabled={rightArrowDisabled} />
            </button>
        </div>
    );
}
