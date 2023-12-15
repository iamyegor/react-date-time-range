import { ReactNode, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectActiveInput,
  selectFirstDate,
  selectFirstSelectedTime,
  selectSecondDate,
  selectSecondSelectedTime,
  setActiveInput,
  setIsDateTimeShown,
} from "../features/dateTimeRangeSlice";
import { ActiveInput } from "../types";
import "./styles/OKButton.css";

interface OKButtonProps {
  children: ReactNode;
}

export default function OKButton({ children }: OKButtonProps) {
  const firstDate = useAppSelector(selectFirstDate);
  const secondDate = useAppSelector(selectSecondDate);
  const firstSelectedTime = useAppSelector(selectFirstSelectedTime);
  const secondSelectedTime = useAppSelector(selectSecondSelectedTime);
  const activeInput = useAppSelector(selectActiveInput);
  const dispatch = useAppDispatch();

  const timer = useRef<NodeJS.Timeout | null>(null);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setIsClicked(false);
      }, 200);

      return () => clearTimeout(timer.current!);
    }
  }, [isClicked]);

  function handleClick() {
    setIsClicked(true);

    const areFirstDateAndTimeSelected = firstDate && firstSelectedTime;
    const areSecondDateAndTimeSelected = secondDate && secondSelectedTime;

    if (!areFirstDateAndTimeSelected && !areSecondDateAndTimeSelected) {
      dispatch(setIsDateTimeShown(false));
    } else if (
      activeInput === ActiveInput.First &&
      !areSecondDateAndTimeSelected
    ) {
      dispatch(setActiveInput(ActiveInput.Second));
    } else if (
      activeInput === ActiveInput.Second &&
      !areFirstDateAndTimeSelected
    ) {
      dispatch(setActiveInput(ActiveInput.First));
    } else {
      dispatch(setIsDateTimeShown(false));
    }
  }

  return (
    <button
      className="flex flex-1 items-center justify-end pr-5 py-2"
      onClick={() => handleClick()}
    >
      <p
        className={`p-0.5 px-3 flex justify-center items-center transition-all
          ease-in duration-200 bg-blue-500 text-white rounded 
          ${isClicked ? "active-shadow" : "shadow shadow-blue-500/50"}`}
      >
        {children}
      </p>
    </button>
  );
}
