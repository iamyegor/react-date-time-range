import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks.ts";
import { selectActiveInput, setDashedBorderDirection } from "../../../redux/dateTimeRangeSlice.ts";
import { ActiveInput, DashedBorderDirection } from "../../../types.tsx";

export default function useChanegDashedBorderDirection() {
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
