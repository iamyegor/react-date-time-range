import { useEffect, useState } from "react";
import { useDateTimeRange } from "../Calendar/DateTimeRangeProvider";
import { ActiveInput, Time } from "../types";
import Selection from "./Selection";
import { startOfDay } from "date-fns";
import { getDefaultSelectedTime } from "../utils";

const hours = Array.from({ length: 11 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
hours.unshift("12");

const minutes = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0")
);
const periods = ["AM", "PM"];

function TimePicker() {
  const {
    firstDate,
    setFirstDate,
    secondDate,
    setSecondDate,
    firstSelectedTime,
    secondSelectedTime,
    setFirstSelectedTime,
    setSecondSelectedTime,
    activeInput,
  } = useDateTimeRange();
  const [selectedTime, setSelectedTime] = useState<Time | null>(null);

  useEffect(() => {
    if (activeInput === ActiveInput.First) {
      setSelectedTime(firstSelectedTime);
    } else if (activeInput === ActiveInput.Second) {
      setSelectedTime(secondSelectedTime);
    }
  }, [activeInput, firstSelectedTime, secondSelectedTime]);

  function handleTimeChange(key: "hours" | "minutes", value: number) {
    if (activeInput === ActiveInput.First) {
      setFirstSelectedTime((prev) => getUpdatedTime(prev, key, value) as Time);
      setFirstDateIfNull();
    } else if (activeInput === ActiveInput.Second) {
      setSecondSelectedTime((prev) => getUpdatedTime(prev, key, value) as Time);
      setSecondDateIfNull();
    }

    setSelectedTime((prev) => getUpdatedTime(prev, key, value) as Time);
  }

  function setFirstDateIfNull() {
    if (!firstDate) {
      setFirstDate(startOfDay(new Date()));
    }
  }

  function setSecondDateIfNull() {
    if (!secondDate) {
      setSecondDate(startOfDay(new Date()));
    }
  }

  function getUpdatedTime(
    prev: Time | null,
    key: "hours" | "minutes",
    value: number
  ) {
    const currentTime = prev || getDefaultSelectedTime();
    return { ...currentTime, [key]: value };
  }

  function handlePeriodChange(period: "AM" | "PM") {
    if (activeInput === ActiveInput.First) {
      setFirstSelectedTime((prev) => getUpdatedPeriod(prev, period));
      setFirstDateIfNull();
    } else if (activeInput === ActiveInput.Second) {
      setSecondSelectedTime((prev) => getUpdatedPeriod(prev, period));
      setSecondDateIfNull();
    }

    setSelectedTime((prev) => getUpdatedPeriod(prev, period));
  }

  function getUpdatedPeriod(prev: Time | null, period: "AM" | "PM") {
    const currentTime = prev || getDefaultSelectedTime();
    return { ...currentTime, period };
  }

  function convertTo2DigitString(num: number) {
    return num.toString().padStart(2, "0");
  }

  return (
    <div className="flex flex-col w-48">
      <div className="flex justify-between px-4 py-2 overflow-hidden">
        <Selection
          items={hours}
          selectedItem={
            selectedTime ? convertTo2DigitString(selectedTime.hours) : ""
          }
          onSelect={(item) => handleTimeChange("hours", Number(item))}
          testid="hours"
        />
        <Selection
          items={minutes}
          selectedItem={
            selectedTime ? convertTo2DigitString(selectedTime.minutes) : ""
          }
          onSelect={(item) => handleTimeChange("minutes", Number(item))}
          testid="minutes"
        />
        <Selection
          items={periods}
          selectedItem={selectedTime ? selectedTime.period : ""}
          onSelect={(item) => handlePeriodChange(item as "AM" | "PM")}
          testid="periods"
        />
      </div>
    </div>
  );
}

export default TimePicker;
