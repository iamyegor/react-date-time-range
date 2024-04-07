import { useEffect, useState } from "react";
import { useAppSelector } from "../../../redux/hooks.ts";
import { minutes } from "../../../constants.ts";
import {
    selectMaxTimeIn24Hours,
    selectMinTimeIn24Hours,
    selectUseAMPM,
} from "../../../redux/dateTimeRangeSlice.ts";
import { Time } from "../../../types.tsx";
import { convertTo24HourFormat } from "../../../utils.ts";

export default function useDisabledMinutes(selectedTime: Time | null) {
    const useAMPM = useAppSelector(selectUseAMPM);
    const minTime = useAppSelector(selectMinTimeIn24Hours);
    const maxTime = useAppSelector(selectMaxTimeIn24Hours);
    const [disabledMinutes, setDisabledMinutes] = useState<string[]>([]);

    useEffect(() => {
        setDisabledMinutes([...getDisabledMinutestForMinTime(), ...getDisabledMinutesForMaxTime()]);
    }, [selectedTime, minTime]);

    function getDisabledMinutestForMinTime() {
        if (!minTime) {
            return [];
        }

        if (useAMPM && minTime.hours >= 12 && selectedTime?.ampm !== "PM") {
            return minutes.slice(0, 60);
        }

        if (selectedTime && convertTo24HourFormat(selectedTime).hours <= minTime.hours) {
            return minutes.slice(0, minTime.minutes);
        }

        return [];
    }

    function getDisabledMinutesForMaxTime() {
        if (!maxTime) {
            return [];
        }

        if (useAMPM && maxTime.hours < 12 && selectedTime?.ampm === "PM") {
            return minutes.slice(0, 60);
        }

        if (selectedTime && convertTo24HourFormat(selectedTime).hours >= maxTime.hours) {
            return minutes.slice(maxTime.minutes + 1);
        }

        return [];
    }

    return disabledMinutes;
}
