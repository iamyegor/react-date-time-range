import { useEffect, useState } from "react";
import { DashedBorderDirection } from "../types.tsx";

export default function useEdgeSelectedDate(
  firstDate: Date | null,
  secondDate: Date | null,
  currentDirection: DashedBorderDirection,
) {
  const [edgeSelectedDate, setEdgeSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (firstDate && !secondDate) {
      setEdgeSelectedDate(firstDate);
    } else if (!firstDate && secondDate) {
      setEdgeSelectedDate(secondDate);
    }

    if (currentDirection === DashedBorderDirection.Left) {
      if (firstDate && secondDate) {
        if (firstDate < secondDate) {
          setEdgeSelectedDate(firstDate);
        } else if (firstDate > secondDate) {
          setEdgeSelectedDate(secondDate);
        }
      }
    } else if (currentDirection === DashedBorderDirection.Right) {
      if (firstDate && secondDate) {
        if (firstDate < secondDate) {
          setEdgeSelectedDate(secondDate);
        } else if (firstDate > secondDate) {
          setEdgeSelectedDate(firstDate);
        }
      }
    }
  }, [firstDate, secondDate, currentDirection]);

  return edgeSelectedDate;
}
