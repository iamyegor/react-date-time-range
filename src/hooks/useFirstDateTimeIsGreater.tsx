import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    selectFirstDate,
    selectFirstSelectedTime,
    selectSecondDate,
    selectSecondSelectedTime,
    setFirstDateTimeIsGreater,
} from "../features/dateTimeRangeSlice";
import { Time } from "../types";
import { convertTo24HourFormat } from "../utils";

export default function useFirstDateTimeIsGreater() {
    const dispatch = useAppDispatch();
    const firstDate = useAppSelector(selectFirstDate);
    const secondDate = useAppSelector(selectSecondDate);
    const firstSelectedTime = useAppSelector(selectFirstSelectedTime);
    const secondSelectedTime = useAppSelector(selectSecondSelectedTime);

    useEffect(() => {
        const firstDateIsGreater = isDateGreater(firstDate, secondDate);
        const datesAreEqual = isDateEqual(firstDate, secondDate);
        const firstTimeIsGreaterOrEqual = isTimeGreaterOrEqual(
            firstSelectedTime,
            secondSelectedTime,
        );

        if (firstDateIsGreater || (datesAreEqual && firstTimeIsGreaterOrEqual)) {
            dispatch(setFirstDateTimeIsGreater(true));
        } else {
            dispatch(setFirstDateTimeIsGreater(false));
        }
    }, [firstDate, secondDate, firstSelectedTime, secondSelectedTime]);

    function isDateGreater(firstDate: Date | null, secondDate: Date | null) {
        return firstDate && secondDate && firstDate > secondDate;
    }

    function isDateEqual(firstDate: Date | null, secondDate: Date | null) {
        return firstDate && secondDate && firstDate >= secondDate;
    }

    function isTimeGreaterOrEqual(firstTime: Time | null, secondTime: Time | null) {
        if (!firstTime || !secondTime) {
            return false;
        }

        const firstTimeHours = convertTo24HourFormat(firstTime).hours;
        const secondTimeHours = convertTo24HourFormat(secondTime).hours;

        return (
            firstTimeHours > secondTimeHours ||
            (firstTimeHours === secondTimeHours && firstTime.minutes >= secondTime.minutes)
        );
    }
}
