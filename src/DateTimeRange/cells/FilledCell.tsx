import classNames from "classnames";
import { format, isEqual, isSameDay } from "date-fns";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks.ts";
import {
    selectActiveInput,
    selectBannedDates,
    selectFirstDate,
    selectFirstSelectedTime,
    selectIsDragging,
    selectMaxDate,
    selectMinDate,
    selectSecondDate,
    selectSecondSelectedTime,
    selectShadowSelectedDate,
    selectUseAMPM,
    setDraggedDate,
    setFirstDate,
    setFirstSelectedTime,
    setHoveredDate,
    setIsDragging,
    setSecondDate,
    setSecondSelectedTime,
} from "../../redux/dateTimeRangeSlice.ts";
import { ActiveInput, DraggedDate } from "../../types.tsx";
import { getDefaultSelectedTime } from "../../utils.ts";
import DashedBorder from "../DashedBorder.tsx";
import Highlight from "../highlights/Highlight.tsx";
import HoverHighlight from "../highlights/HoverHighlight.tsx";
import "./styles/dayCell.css";
import "./styles/filledCell.css";

interface FilledCellProps {
    day: Date;
}

function FilledCell({ day }: FilledCellProps): ReactElement {
    const dispatch = useAppDispatch();
    const activeInput = useSelector(selectActiveInput);
    const minDate = useSelector(selectMinDate);
    const maxDate = useSelector(selectMaxDate);
    const firstDate = useSelector(selectFirstDate);
    const secondDate = useSelector(selectSecondDate);
    const isDragging = useSelector(selectIsDragging);
    const shadowSelectedDate = useSelector(selectShadowSelectedDate);
    const bannedDates = useSelector(selectBannedDates);
    const firstSelectedTime = useSelector(selectFirstSelectedTime);
    const secondSelectedTime = useSelector(selectSecondSelectedTime);
    const useAMPM = useSelector(selectUseAMPM);

    function isDateOutsideRange() {
        return (minDate && day < minDate) || (maxDate && day > maxDate);
    }

    const isDateSelected = (date: Date) =>
        (firstDate && isSameDay(date, firstDate)) || (secondDate && isSameDay(date, secondDate));

    const isToday = isSameDay(day, new Date());

    function getClassesForDay(): string {
        return classNames({
            "selected-cell": isDateSelected(day),
            "hover:cursor-grabbing": isDragging,
            "hover:cursor-grab": !isDragging && isDateSelected(day),
            "hover:cursor-pointer": !isDateSelected(day),
            "border border-gray-300 rounded-full": isToday,
            "border bg-blue-400/50 text-white":
                shadowSelectedDate && isSameDay(day, shadowSelectedDate),
        });
    }

    function getDayCellClasses(): string {
        return classNames(getClassesForDay(), {
            "selected-cell": isDateSelected(day),
            "hovered-cell": !isDateSelected(day) && !isDateOutsideRange,
            "group-hover:border-none group-hover:bg-transparent":
                firstDate && secondDate && day > firstDate && day < secondDate,
            "line-through text-gray-500 group-hover:cursor-default": bannedDates.some((date) =>
                isSameDay(date, day),
            ),
            "disabled-cell": isDateOutsideRange(),
        });
    }

    function handleMouseDown() {
        if (firstDate && isEqual(firstDate, day)) {
            dispatch(setIsDragging(true));
            dispatch(setDraggedDate(DraggedDate.First));
        } else if (secondDate && isEqual(secondDate, day)) {
            dispatch(setIsDragging(true));
            dispatch(setDraggedDate(DraggedDate.Second));
        }
    }

    function getCursorWhenDragging(): string {
        return isDragging ? "cursor-grabbing" : "";
    }

    function handleCellClick() {
        if (!isDateOutsideRange()) {
            setDatesBasedOnActiveInput(day);
            setDefaultTimeIfNotSet();
        }
    }

    function setDatesBasedOnActiveInput(day: Date) {
        if (activeInput === ActiveInput.First) {
            setDatesBasedOnFirstInput(day);
        } else if (activeInput === ActiveInput.Second) {
            setDatesBasedOnSecondInput(day);
        }
    }

    function setDatesBasedOnFirstInput(day: Date) {
        dispatch(setFirstDate(day));
        if (secondDate && day > secondDate) {
            dispatch(setSecondDate(null));
        }
    }

    function setDatesBasedOnSecondInput(day: Date) {
        if (firstDate && day < firstDate) {
            dispatch(setFirstDate(day));
            dispatch(setSecondDate(null));
        } else {
            dispatch(setSecondDate(day));
        }
    }

    function setDefaultTimeIfNotSet() {
        if (activeInput === ActiveInput.First && !firstSelectedTime) {
            dispatch(setFirstSelectedTime(getDefaultSelectedTime(useAMPM)));
        } else if (activeInput === ActiveInput.Second && !secondSelectedTime) {
            dispatch(setSecondSelectedTime(getDefaultSelectedTime(useAMPM)));
        }
    }

    return (
        <div
            className={`flex-1 py-1 flex justify-center items-center group relative
      ${getCursorWhenDragging()}`}
            onClick={() => handleCellClick()}
            onMouseEnter={() => dispatch(setHoveredDate(day))}
            onMouseLeave={() => dispatch(setHoveredDate(null))}
            onMouseDown={handleMouseDown}
            data-testid="filled-cell"
        >
            <DashedBorder day={day} />
            <div
                className={`w-9 h-9 flex items-center justify-center text-xs
        transition-all rounded-full ${getDayCellClasses()} z-10 `}
                data-testid={`${isDateSelected(day) ? "selected-cell" : "not-selected-cell"}`}
            >
                {format(day, "d")}
            </div>
            <HoverHighlight day={day} />
            <Highlight day={day} />
        </div>
    );
}

export default FilledCell;
