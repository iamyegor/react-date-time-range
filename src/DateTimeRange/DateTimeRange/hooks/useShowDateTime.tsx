import { useEffect } from "react";
import { useAppDispatch } from "../../../redux/hooks.ts";
import { setIsDateTimeShown } from "../../../redux/dateTimeRangeSlice.ts";

export default function useShowDateTime(dateTimeContainer: HTMLElement | null) {
    const dispatch = useAppDispatch();

    function handleClickOutside(event: MouseEvent) {
        const { target } = event;
        if (
            (dateTimeContainer && !dateTimeContainer.contains(target as Node)) ||
            dateTimeContainer === target
        ) {
            dispatch(setIsDateTimeShown(false));
        }
    }

    useEffect(() => {
        if (dateTimeContainer) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            if (dateTimeContainer) {
                document.removeEventListener("mousedown", handleClickOutside);
            }
        };
    }, [dateTimeContainer]);
}
