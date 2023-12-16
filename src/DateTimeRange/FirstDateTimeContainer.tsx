import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectActiveInput,
  selectFirstDate,
  selectFirstSelectedTime,
  setActiveInput,
  setFirstDate,
  setFirstSelectedTime,
  setIsDateTimeShown,
} from "../features/dateTimeRangeSlice";
import { ActiveInput } from "../types";
import DateTimeContainer from "./DateTimeContainer";

export default function FirstDateTimeContainer({ text }: { text: string }) {
  const dispatch = useAppDispatch();

  const firstDate = useAppSelector(selectFirstDate);
  const firstSelectedTime = useAppSelector(selectFirstSelectedTime);
  const activeInput = useAppSelector(selectActiveInput);

  const [isFirstDateInvalid, setIsFirstDateInvalid] = useState(false);
  const [isFirstTimeInvalid, setIsFirstTimeInvalid] = useState(false);

  function handleInputFocus() {
    dispatch(setActiveInput(ActiveInput.First));
    dispatch(setIsDateTimeShown(true));
  }

  function updateIsDateInvalid(isInvalid: boolean) {
    setIsFirstDateInvalid(isInvalid);
  }

  function updateIsTimeInvalid(isInvalid: boolean) {
    setIsFirstTimeInvalid(isInvalid);
  }

  return (
    <DateTimeContainer
      isActive={activeInput === ActiveInput.First}
      text={text}
      date={firstDate}
      updateDate={(date) => dispatch(setFirstDate(date))}
      time={firstSelectedTime}
      updateTime={(time) => dispatch(setFirstSelectedTime(time))}
      onFocus={handleInputFocus}
      isDateInvalid={isFirstDateInvalid}
      updateIsDateInvalid={updateIsDateInvalid}
      isTimeInvalid={isFirstTimeInvalid}
      updateIsTimeInvalid={updateIsTimeInvalid}
      testid="first-date-time-container"
    />
  );
}
