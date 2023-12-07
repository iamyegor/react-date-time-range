import { useEffect, useState } from "react";
import { ActiveInput, DashedBorderDirection } from "../types.tsx";

export default function useCurrentDirection(
  activeInput: ActiveInput,
) {
  const [currentDirection, setCurrentDirection] = useState<DashedBorderDirection>(
    DashedBorderDirection.Left,
  );

  useEffect(() => {
    if (activeInput === ActiveInput.First) {
      setCurrentDirection(DashedBorderDirection.Left);
    } else {
      setCurrentDirection(DashedBorderDirection.Right);
    }
  }, [activeInput]);

  return currentDirection;
}
