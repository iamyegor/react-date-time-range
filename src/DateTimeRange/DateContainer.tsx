import { format } from "date-fns";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import calendarIcon from "../assets/icons/calendar.svg";
import { Time } from "../types";
import DateInput from "./DateInput";

interface DateContainerProps {
  text: string;
  date: Date | null;
  setDate: Dispatch<SetStateAction<Date | null>>;
  time: Time | null;
  setTime: Dispatch<SetStateAction<Time | null>>;
  onFocus: () => void;
  isActive: boolean;
}

function DateContainer({
  text,
  date,
  setDate,
  time,
  setTime,
  onFocus,
  isActive,
}: DateContainerProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [textWidth, setTextWidth] = useState<number>(0);
  const [shouldRemoveHiddenText, setShouldRemoveHiddenText] =
    useState<boolean>(false);
  const hiddenTextRef = useRef<HTMLLabelElement>(null);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (hiddenTextRef.current) {
      const width = hiddenTextRef.current.offsetWidth;
      setTextWidth(width);
      setShouldRemoveHiddenText(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldTextBeOnTop()) {
      setValue("");
    } else {
      setValue(`${getFormattedDateOrDefault()} ${getFormattedTimeOrDefault()}`);
    }
  }, [
    getFormattedDateOrDefault(),
    getFormattedTimeOrDefault(),
    shouldTextBeOnTop(),
  ]);

  function handleFocus() {
    setIsFocused(true);
    onFocus();
  }

  function handleBlur() {
    setIsFocused(false);
  }

  function shouldTextBeOnTop() {
    return isFocused || date || time || isActive;
  }

  function shouldHaveOutline() {
    return isFocused || isActive;
  }

  const clipPath = shouldTextBeOnTop()
    ? `polygon(10px 0, 10px 10%, ${textWidth + 14}px 10%, ${
        textWidth + 14
      }px 0, 100% 0, 100% 100%, 0 100%, 0 0)`
    : "";

  function getFormattedDateOrDefault() {
    if (date) {
      return format(date, "MM/dd/yyyy");
    } else {
      return "MM/dd/yyyy";
    }
  }

  function getFormattedTimeOrDefault() {
    if (time) {
      const hours = time.hours.toString().padStart(2, "0");
      const minutes = time.minutes.toString().padStart(2, "0");
      return `${hours}:${minutes} ${time.ampm}`;
    } else {
      return "hh:mm aa";
    }
  }

  return (
    <div
      className="relative group w-[15rem] h-10 cursor-text"
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div
        className={`rounded border flex justify-between items-center relative
  focus:outline-none h-full transition-colors ${
    shouldHaveOutline()
      ? "border-blue-500 border-2"
      : "border-gray-700 group-hover:border-gray-400"
  }`}
        tabIndex={0}
        style={{ clipPath }}
      >
        {shouldTextBeOnTop() && (
          <DateInput
            date={date}
            time={time}
            setDate={setDate}
            setTime={setTime}
          />
        )}
        <img src={calendarIcon} className=" absolute right-2 w-5 h-5" />
      </div>
      <label
        className={`transition-all absolute left-0 cursor-text ${
          shouldTextBeOnTop()
            ? "left-3 -top-[0.725rem] text-xs"
            : "transform -translate-y-1/2 top-1/2 left-2 text-base"
        } ${shouldHaveOutline() ? "text-blue-500" : "text-gray-800"}`}
        tabIndex={0}
      >
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

export default DateContainer;
