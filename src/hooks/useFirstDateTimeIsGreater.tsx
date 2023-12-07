import { useEffect, useState } from "react";
import { Time } from "../types";

export default function useFirstDateTimeIsGreater(
  firstDate: Date | null,
  secondDate: Date | null,
  firstSelectedTime: Time | null,
  secondSelectedTime: Time | null,
) {
  const [firstDateTimeIsGreater, setFirstDateTimeIsGreater] =
    useState<boolean>(false);

  useEffect(() => {
    const firstDateIsGreater = isDateGreater(firstDate, secondDate);
    const datesAreEqual = isDateEqual(firstDate, secondDate);
    const firstTimeIsGreaterOrEqual = isTimeGreaterOrEqual(
      firstSelectedTime,
      secondSelectedTime,
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
    secondTime: Time | null,
  ) {
    if (!firstTime || !secondTime) {
      return false;
    }

    const firstTimeHours = hoursIn24HourFormat(firstTime);
    const secondTimeHours = hoursIn24HourFormat(secondTime);

    return (
      firstTimeHours > secondTimeHours ||
      (firstTimeHours === secondTimeHours &&
        firstTime.minutes >= secondTime.minutes)
    );
  }

  function hoursIn24HourFormat(time: Time) {
    return time.ampm == "PM" ? time.hours + 12 : time.hours;
  }

  return firstDateTimeIsGreater;
}
