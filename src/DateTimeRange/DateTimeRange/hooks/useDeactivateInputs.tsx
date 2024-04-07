import { useEffect } from "react";
import { selectIsDateTimeShown, setActiveInput } from "../../../redux/dateTimeRangeSlice.ts";
import { ActiveInput } from "../../../types.tsx";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks.ts";

export default function useDeactivateInputs() {
    const dispatch = useAppDispatch();
    const isDateTimeShown = useAppSelector(selectIsDateTimeShown);

    useEffect(() => {
        if (!isDateTimeShown) {
            dispatch(setActiveInput(ActiveInput.None));
        }
    }, [isDateTimeShown]);
}
