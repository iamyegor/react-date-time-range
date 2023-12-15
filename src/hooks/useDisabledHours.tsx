import { useEffect, useState } from "react";
import { Time, TimeIn24HourFormat } from "../types";

const hours12 = Array.from({ length: 11 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
hours12.unshift("12");

const hours24 = Array.from({ length: 23 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

export default function useDisabledHours(
  minTime: TimeIn24HourFormat | undefined,
  selectedTime: Time | null,
  isAMPM: boolean
) {
  const [disabledHours, setDisabledHours] = useState<string[]>([]);

  useEffect(() => {
    if (!minTime) {
      return;
    }

    if (isAMPM) {
      if (selectedTime?.ampm === "PM") {
        if (minTime.hours > 12) {
          setDisabledHours(hours12.slice(0, minTime.hours - 12));
        } else {
          setDisabledHours([]);
        }
      } else {
        if (minTime.hours < 12) {
          setDisabledHours(hours12.slice(0, minTime.hours));
        } else {
          setDisabledHours(hours12);
        }
      }
    } else {
      setDisabledHours(hours24.slice(0, minTime.hours - 1));
    }
    // const tempDisabledHours: string[] = [];
    // for (let i = 1; i < minTime?.hours; i++) {
    //   tempDisabledHours.push(convertTo2DigitString(i));
    // }

    // if (isAMPM && !tempDisabledHours.includes("12")) {
    //   tempDisabledHours.push(convertTo2DigitString(12));
    // }

    // setDisabledHours(tempDisabledHours);
  }, [minTime]);

  return disabledHours;
}