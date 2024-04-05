import { addDays, endOfMonth, endOfWeek, isEqual, startOfMonth, startOfWeek } from "date-fns";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    selectDraggedDate,
    selectFirstDate,
    selectHoveredDate,
    selectIsDragging,
    selectMaxDate,
    selectMinDate,
    selectSecondDate,
    setDateChangedWhileDragging,
    setDraggedDate,
    setFirstDate,
    setIsDragging,
    setSecondDate,
    setShadowSelectedDate,
} from "../features/dateTimeRangeSlice";
import { DraggedDate } from "../types";
import WeekRow from "./WeekRow";

interface CellsProps {
    currentMonth: Date;
}

const DAYS_IN_A_WEEK = 7;

function Cells({ currentMonth }: CellsProps): ReactElement {
    const dispatch = useAppDispatch();
    const firstDate = useAppSelector(selectFirstDate);
    const secondDate = useAppSelector(selectSecondDate);
    const hoveredDate = useAppSelector(selectHoveredDate);
    const draggedDate = useAppSelector(selectDraggedDate);
    const isDragging = useAppSelector(selectIsDragging);
    const minDate = useAppSelector(selectMinDate);
    const maxDate = useAppSelector(selectMaxDate);

    const [firstDateBeforeDrag, setFirstDateBeforeDrag] = useState<Date | null>(null);
    const [secondDateBeforeDrag, setSecondDateBeforeDrag] = useState<Date | null>(null);

    useEffect(() => {
        if (hoveredDate && isDragging) {
            if (draggedDate === DraggedDate.First) {
                handleFirtDateDrag();
            } else if (draggedDate === DraggedDate.Second) {
                handleSecondDateDrag();
            }
        }
    }, [hoveredDate, draggedDate]);

    function handleFirtDateDrag() {
        if (!hoveredDate) {
            return;
        }

        if (isDateOutsideRange(hoveredDate)) {
            dispatch(setIsDragging(false));
            return;
        }

        if (secondDate && hoveredDate > secondDate) {
            changeDragToSecondDate();
        } else {
            dispatch(setFirstDate(hoveredDate));
        }
    }

    function isDateOutsideRange(hoveredDate: Date) {
        return (minDate && hoveredDate < minDate) || (maxDate && hoveredDate > maxDate);
    }

    function changeDragToSecondDate() {
        dispatch(setFirstDate(secondDate));
        dispatch(setSecondDate(hoveredDate));
        dispatch(setDraggedDate(DraggedDate.Second));
    }

    function handleSecondDateDrag() {
        if (!hoveredDate) {
            return;
        }

        if (isDateOutsideRange(hoveredDate)) {
            dispatch(setIsDragging(false));
            return;
        }

        if (firstDate && hoveredDate < firstDate) {
            changeDragToFirstDate();
        } else {
            dispatch(setSecondDate(hoveredDate));
        }
    }

    function changeDragToFirstDate() {
        dispatch(setSecondDate(firstDate));
        dispatch(setFirstDate(hoveredDate));
        dispatch(setDraggedDate(DraggedDate.First));
    }

    useEffect(() => {
        if (hoveredDate && isDragging) {
            if (firstDateBeforeDrag) {
                if (!isEqual(firstDateBeforeDrag, hoveredDate)) {
                    dispatch(setDateChangedWhileDragging(true));
                }
            } else if (secondDateBeforeDrag) {
                if (!isEqual(secondDateBeforeDrag, hoveredDate)) {
                    dispatch(setDateChangedWhileDragging(true));
                }
            }
        }
    }, [hoveredDate, isDragging]);

    useEffect(() => {
        if (isDragging) {
            if (draggedDate === DraggedDate.First) {
                dispatch(setShadowSelectedDate(firstDate));
            }
            if (draggedDate === DraggedDate.Second) {
                dispatch(setShadowSelectedDate(secondDate));
            }
        } else {
            dispatch(setShadowSelectedDate(null));
        }
    }, [isDragging]);

    useEffect(() => {
        if (isDragging) {
            setFirstDateBeforeDrag(firstDate);
            setSecondDateBeforeDrag(secondDate);
        } else {
            setFirstDateBeforeDrag(null);
            setSecondDateBeforeDrag(null);

            dispatch(setDateChangedWhileDragging(false));
        }
    }, [isDragging]);

    const rows = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        let weeks: ReactElement[] = [];
        let currentDate = startDate;
        while (currentDate <= endDate) {
            weeks.push(
                <WeekRow
                    key={currentDate.toDateString()}
                    startOfWeek={currentDate}
                    currentMonth={currentMonth}
                />,
            );
            currentDate = addDays(currentDate, DAYS_IN_A_WEEK);
        }
        return weeks;
    }, [currentMonth, firstDate, secondDate, hoveredDate]);

    return (
        <div data-testid="cells" className={`flex-shrink-0 w-full`}>
            {rows}
        </div>
    );
}

export default Cells;
