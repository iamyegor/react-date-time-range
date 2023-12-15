import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import {
  selectFirstSelectedTime,
  selectMinTimeIn24Hours,
  selectSecondSelectedTime,
} from "../features/dateTimeRangeSlice";
import { isTimeLesser } from "../utils";

export default function useIsTimeLessThanMinTime() {
  const firstSelectedTime = useAppSelector(selectFirstSelectedTime);
  const secondSelectedTime = useAppSelector(selectSecondSelectedTime);
  const minTimeIn24Hours = useAppSelector(selectMinTimeIn24Hours);

  const [isFirstTimeLessThanMinTime, setIsFirstTimeLessThanMinTime] =
    useState<boolean>(false);
  const [isSecondTimeLessThanMinTime, setIsSecondTimeLessThanMinTime] =
    useState<boolean>(false);

  useEffect(() => {
    if (!minTimeIn24Hours) {
      return;
    }

    if (isTimeLesser(firstSelectedTime, minTimeIn24Hours)) {
      setIsFirstTimeLessThanMinTime(true);
    } else {
      setIsFirstTimeLessThanMinTime(false);
    }

    if (isTimeLesser(secondSelectedTime, minTimeIn24Hours)) {
      setIsSecondTimeLessThanMinTime(true);
    } else {
      setIsSecondTimeLessThanMinTime(false);
    }
  }, [minTimeIn24Hours, firstSelectedTime, secondSelectedTime]);

  return { isFirstTimeLessThanMinTime, isSecondTimeLessThanMinTime };
}
