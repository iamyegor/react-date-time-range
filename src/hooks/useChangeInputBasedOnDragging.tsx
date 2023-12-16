import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectDraggedDate,
  selectIsDragging,
  selectDateChangedWhileDragging,
  setActiveInput,
} from "../features/dateTimeRangeSlice";
import { DraggedDate, ActiveInput } from "../types";

export default function useChangeInputBasedOnDragging() {
  const dispatch = useAppDispatch();

  const draggedDate = useAppSelector(selectDraggedDate);
  const isDragging = useAppSelector(selectIsDragging);
  const dateChangedWhileDragging = useAppSelector(
    selectDateChangedWhileDragging
  );

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
