import { useEffect, useState } from "react";

export default function useIsDateLessThanMinDate(
  firstDate: Date | null,
  secondDate: Date | null,
  minDate: Date | null
) {
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
