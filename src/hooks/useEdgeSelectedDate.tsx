import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import {
  selectDashedBorderDirection,
  selectFirstDate,
  selectSecondDate,
  setEdgeSelectedDate,
} from "../features/dateTimeRangeSlice.ts";
import { DashedBorderDirection } from "../types.tsx";

export default function useEdgeSelectedDate() {
  const dispatch = useAppDispatch();

  const firstDate = useAppSelector(selectFirstDate);
  const secondDate = useAppSelector(selectSecondDate);
  const dashedBorderDirection = useAppSelector(selectDashedBorderDirection);

  useEffect(() => {
    if (firstDate && !secondDate) {
      dispatch(setEdgeSelectedDate(firstDate));
    } else if (!firstDate && secondDate) {
      dispatch(setEdgeSelectedDate(secondDate));
    }

    if (dashedBorderDirection === DashedBorderDirection.Left) {
      if (firstDate && secondDate) {
        if (firstDate < secondDate) {
          dispatch(setEdgeSelectedDate(firstDate));
        } else if (firstDate > secondDate) {
          dispatch(setEdgeSelectedDate(secondDate));
        }
      }
    } else if (dashedBorderDirection === DashedBorderDirection.Right) {
      if (firstDate && secondDate) {
        if (firstDate < secondDate) {
          dispatch(setEdgeSelectedDate(secondDate));
        } else if (firstDate > secondDate) {
          dispatch(setEdgeSelectedDate(firstDate));
        }
      }
    }
  }, [firstDate, secondDate, dashedBorderDirection]);
}
