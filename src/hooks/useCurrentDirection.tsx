import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import {
  selectActiveInput,
  setDashedBorderDirection,
} from "../features/dateTimeRangeSlice.ts";
import { ActiveInput, DashedBorderDirection } from "../types.tsx";

export default function useCurrentDirection() {
  const dispatch = useAppDispatch();
  const activeInput = useAppSelector(selectActiveInput);

  useEffect(() => {
    if (activeInput === ActiveInput.First) {
      dispatch(setDashedBorderDirection(DashedBorderDirection.Left));
    } else {
      dispatch(setDashedBorderDirection(DashedBorderDirection.Right));
    }
  }, [activeInput]);
}
