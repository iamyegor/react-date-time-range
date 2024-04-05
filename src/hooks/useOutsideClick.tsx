import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { setIsDateTimeShown } from "../features/dateTimeRangeSlice";

export default function useIsDateTimeShown(dateTimeContainer: HTMLElement | null) {
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
