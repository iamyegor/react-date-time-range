import { useEffect, useState } from "react";
import { minutes } from "../constants";
import { Time, TimeIn24HourFormat } from "../types";
import { convertTo24HourFormat } from "../utils";

export default function useDisabledMinutes(
  minTime: TimeIn24HourFormat | undefined,
  selectedTime: Time | null
) {
  const [disabledMinutes, setDisabledMinutes] = useState<string[]>([]);

  useEffect(() => {
    if (!minTime) {
      return;
    }

    if (!selectedTime) {
      if (minTime.hours >= 12) {
        setDisabledMinutes(minutes.slice(0, 60));
      }
      return;
    }

    if (convertTo24HourFormat(selectedTime).hours <= minTime.hours) {
      setDisabledMinutes(minutes.slice(0, minTime.minutes));
    } else {
      setDisabledMinutes([]);
    }
  }, [selectedTime, minTime]);

  return disabledMinutes;
}
