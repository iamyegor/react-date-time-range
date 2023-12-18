import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { hours12, hours24 } from "../constants";
import {
  selectMaxTimeIn24Hours,
  selectMinTimeIn24Hours,
} from "../features/dateTimeRangeSlice";
import { Time } from "../types";

export default function useDisabledHours(
  selectedTime: Time | null,
  isAMPM: boolean
) {
  const minTime = useAppSelector(selectMinTimeIn24Hours);
  const maxTime = useAppSelector(selectMaxTimeIn24Hours);
  const [disabledHours, setDisabledHours] = useState<string[]>([]);

  useEffect(() => {
    setDisabledHours([
      ...getDisabledHoursForMinTime(),
      ...getDisabledHourForMaxTime(),
    ]);
  }, [minTime, maxTime, selectedTime]);

  function getDisabledHoursForMinTime() {
    if (!minTime) {
      return [];
    }

    if (isAMPM) {
      if (selectedTime?.ampm === "PM") {
        return minTime.hours > 12 ? hours12.slice(0, minTime.hours - 12) : [];
      } else {
        return minTime.hours > 12 ? hours12 : hours12.slice(0, minTime.hours);
      }
    } else {
      return hours24.slice(0, minTime.hours - 1);
    }
  }

  function getDisabledHourForMaxTime() {
    if (!maxTime) {
      return [];
    }

    if (isAMPM) {
      if (selectedTime?.ampm === "PM") {
        return maxTime.hours > 12 ? hours12.slice(maxTime.hours - 12 + 1) : hours12;
      } else {
        return maxTime.hours > 12 ? [] : hours12.slice(maxTime.hours + 1);
      }
    } else {
      return hours24.slice(maxTime.hours);
    }
  }

  return disabledHours;
}
