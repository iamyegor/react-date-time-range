import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks.ts";
import {
    selectDateChangedWhileDragging,
    selectDraggedDate,
    selectIsDragging,
    setActiveInput,
} from "../../../redux/dateTimeRangeSlice.ts";
import { ActiveInput, DraggedDate } from "../../../types.tsx";

export default function useChangeInputBasedOnDragging() {
    const dispatch = useAppDispatch();

    const draggedDate = useAppSelector(selectDraggedDate);
    const isDragging = useAppSelector(selectIsDragging);
    const dateChangedWhileDragging = useAppSelector(selectDateChangedWhileDragging);

    useEffect(() => {
        if (isDragging && dateChangedWhileDragging) {
            if (draggedDate === DraggedDate.First) {
                dispatch(setActiveInput(ActiveInput.First));
            } else if (draggedDate === DraggedDate.Second) {
                dispatch(setActiveInput(ActiveInput.Second));
            }
        }
    }, [draggedDate, isDragging, dateChangedWhileDragging]);
}
