import { useEffect, useState } from "react";
import { isTimeLesser } from "../utils";
import { Time } from "../types";

export default function useIsTimeLessThanMinTime(
  firstSelectedTime: Time | null,
  secondSelectedTime: Time | null,
  minTimeIn24Hours: Time | null
) {
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
