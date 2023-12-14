import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useDateTimeRange } from "../Calendar/DateTimeRangeProvider.tsx";
import calendarIcon from "../assets/icons/calendar.svg";
import { getDateTimePlaceholder } from "../globals.ts";
import { Time } from "../types.tsx";
import DateTimeInput from "./DateTimeInput.tsx";
import "./styles/DateTimeContainer.css";

interface DateTimeConatinerProps {
  text: string;
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  time: Time | null;
  onTimeChange: (time: Time | null) => void;
  onFocus: () => void;
  isActive: boolean;
  testid?: string;
  isTimeLessThanMinTime: boolean;
  isDateInvalid: boolean;
  onIsDateInvalidChange: (date: boolean) => void;
  isTimeInvalid: boolean;
  onIsTimeInvalidChange: (date: boolean) => void;
  isDateLessThanMinDate: boolean;
}

function DateTimeContainer({
  isDateLessThanMinDate,
  isTimeInvalid,
  onIsTimeInvalidChange,
  isDateInvalid,
  onIsDateInvalidChange,
  isTimeLessThanMinTime,
  testid = "date-time-container",
  text,
  date,
  onDateChange,
  time,
  onTimeChange,
  onFocus,
  isActive,
}: DateTimeConatinerProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [textWidth, setTextWidth] = useState<number>(0);
  const [shouldRemoveHiddenText, setShouldRemoveHiddenText] =
    useState<boolean>(false);
  const hiddenTextRef = useRef<HTMLLabelElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const { firstDateTimeIsGreater } = useDateTimeRange();
  const { useAMPM } = useDateTimeRange();

  useEffect(() => {
    if (hiddenTextRef.current) {
      const width = hiddenTextRef.current.offsetWidth;
      setTextWidth(width);
      setShouldRemoveHiddenText(true);
    }
  }, []);

  function handleFocus() {
    setIsFocused(true);
    onFocus();
  }

  function handleBlur() {
    setIsFocused(false);
  }

  function shouldTextBeOnTop() {
    return (
      isFocused ||
      date ||
      time ||
      isActive ||
      (inputValue && inputValue !== getDateTimePlaceholder(useAMPM))
    );
  }

  function shouldHaveOutline() {
    return isFocused || isActive;
  }

  function shouldInvalidateInput() {
    return (
      firstDateTimeIsGreater ||
      isTimeLessThanMinTime ||
      isDateInvalid ||
      isTimeInvalid ||
      isDateLessThanMinDate
    );
  }

  function handleValueChange(value: string) {
    setInputValue(value);
  }

  function getInputClasses() {
    return classNames({
      "border-blue-500 border-2": shouldHaveOutline(),
      "border-gray-700 group-hover:border-gray-400 border-1":
        !shouldHaveOutline(),
      "border-red-600 group-hover:border-red-600": shouldInvalidateInput(),
      "rounded border flex justify-between items-center relative focus:outline-none h-full transition-colors":
        true,
      "invalid-input": shouldInvalidateInput(),
    });
  }

  function getLabelClasses() {
    return classNames({
      "transition-all absolute left-0 cursor-text": true,
      "left-3 -top-[0.725rem] text-xs": shouldTextBeOnTop(),
      "transform -translate-y-1/2 top-1/2 left-2 text-base":
        !shouldTextBeOnTop(),
      "text-blue-500": shouldHaveOutline() && !shouldInvalidateInput(),
      "text-gray-800": !shouldHaveOutline() && !shouldInvalidateInput(),
      "invalid-label": shouldInvalidateInput(),
    });
  }

  const clipPath = shouldTextBeOnTop()
    ? `polygon(10px 0, 10px 10%, ${textWidth + 14}px 10%, ${
        textWidth + 14
      }px 0, 100% 0, 100% 100%, 0 100%, 0 0)`
    : "";

  return (
    <div
      className="relative group w-[15rem] h-10 cursor-text"
      onFocus={handleFocus}
      onBlur={handleBlur}
      data-testid={testid}
    >
      <div
        className={getInputClasses()}
        tabIndex={0}
        style={{ clipPath }}
        data-testid="date-time-input"
      >
        {shouldTextBeOnTop() && (
          <DateTimeInput
            date={date}
            time={time}
            onDateChange={onDateChange}
            onTimeChange={onTimeChange}
            value={inputValue}
            onValueChange={handleValueChange}
            isDateInvalid={isDateInvalid}
            onIsDateInvalidChange={onIsDateInvalidChange}
            isTimeInvalid={isTimeInvalid}
            onIsTimeInvalidChange={onIsTimeInvalidChange}
          />
        )}
        <img src={calendarIcon} className=" absolute right-2 w-5 h-5" />
      </div>
      <label className={getLabelClasses()} tabIndex={0}>
        {text}
      </label>
      {!shouldRemoveHiddenText && (
        <label
          className="absolute left-2 -top-[0.725rem] text-xs collapse"
          tabIndex={0}
          aria-label="hidden"
          ref={hiddenTextRef}
        >
          {text}
        </label>
      )}
    </div>
  );
}

export default DateTimeContainer;
