import { useEffect } from "react";
import { selectIsDateTimeShown, setActiveInput } from "../features/dateTimeRangeSlice";
import { ActiveInput } from "../types";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export default function useDeactivateInputs() {
    const dispatch = useAppDispatch();
    const isDateTimeShown = useAppSelector(selectIsDateTimeShown);

    useEffect(() => {
        if (!isDateTimeShown) {
            dispatch(setActiveInput(ActiveInput.None));
        }
    }, [isDateTimeShown]);
}
