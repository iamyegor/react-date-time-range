import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import {
  selectFirstDate,
  selectMinDate,
  selectSecondDate
} from "../features/dateTimeRangeSlice";

export default function useIsDateLessThanMinDate() {
  const firstDate = useAppSelector(selectFirstDate);
  const secondDate = useAppSelector(selectSecondDate);
  const minDate = useAppSelector(selectMinDate);

  const [isFirstDateLessThanMinDate, setIsFirstDateLessThanMinDate] =
    useState<boolean>(false);
  const [isSecondDateLessThanMinDate, setIsSecondDateLessThanMinDate] =
    useState<boolean>(false);

  useEffect(() => {
    if (!minDate) {
      return;
    }

    if (firstDate && firstDate < minDate) {
      setIsFirstDateLessThanMinDate(true);
    } else {
      setIsFirstDateLessThanMinDate(false);
    }

    if (secondDate && secondDate < minDate) {
      setIsSecondDateLessThanMinDate(true);
    } else {
      setIsSecondDateLessThanMinDate(false);
    }
  });

  return { isFirstDateLessThanMinDate, isSecondDateLessThanMinDate };
}
