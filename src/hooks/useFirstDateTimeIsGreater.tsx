import { useEffect, useState } from "react";
import { Time } from "../types";
import { convertTo24HourFormat } from "../utils";

export default function useFirstDateTimeIsGreater(
  firstDate: Date | null,
  secondDate: Date | null,
  firstSelectedTime: Time | null,
  secondSelectedTime: Time | null
) {
  const [firstDateTimeIsGreater, setFirstDateTimeIsGreater] =
    useState<boolean>(false);

  useEffect(() => {
    const firstDateIsGreater = isDateGreater(firstDate, secondDate);
    const datesAreEqual = isDateEqual(firstDate, secondDate);
    const firstTimeIsGreaterOrEqual = isTimeGreaterOrEqual(
      firstSelectedTime,
      secondSelectedTime
    );

    if (firstDateIsGreater || (datesAreEqual && firstTimeIsGreaterOrEqual)) {
      setFirstDateTimeIsGreater(true);
    } else {
      setFirstDateTimeIsGreater(false);
    }
  }, [firstDate, secondDate, firstSelectedTime, secondSelectedTime]);

  function isDateGreater(firstDate: Date | null, secondDate: Date | null) {
    return firstDate && secondDate && firstDate > secondDate;
  }

  function isDateEqual(firstDate: Date | null, secondDate: Date | null) {
    return firstDate && secondDate && firstDate >= secondDate;
  }

  function isTimeGreaterOrEqual(
    firstTime: Time | null,
    secondTime: Time | null
  ) {
    if (!firstTime || !secondTime) {
      return false;
    }

    const firstTimeHours = convertTo24HourFormat(firstTime).hours;
    const secondTimeHours = convertTo24HourFormat(secondTime).hours;

    return (
      firstTimeHours > secondTimeHours ||
      (firstTimeHours === secondTimeHours &&
        firstTime.minutes >= secondTime.minutes)
    );
  }

  return firstDateTimeIsGreater;
}
