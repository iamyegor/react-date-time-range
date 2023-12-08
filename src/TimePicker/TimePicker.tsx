import { useEffect, useState } from "react";
import { useDateTimeRange } from "../Calendar/DateTimeRangeProvider";
import { ActiveInput, Time } from "../types";
import Selection from "./Selection";
import { startOfDay } from "date-fns";
import { getDefaultSelectedTime } from "../utils";

const hours = Array.from({ length: 11 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
hours.unshift("12");

const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const periods = ["AM", "PM"];

function TimePicker() {
  const {
    firstDate,
    onFirstDateChange,
    secondDate,
    onSecondDateChange,
    firstSelectedTime,
    secondSelectedTime,
    onFirstSelectedTimeChange,
    onSecondSelectedTimeChange,
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
      onFirstSelectedTimeChange(
        getUpdatedTime(firstSelectedTime, key, value) as Time,
      );
      setFirstDateIfNull();
    } else if (activeInput === ActiveInput.Second) {
      onSecondSelectedTimeChange(
        getUpdatedTime(secondSelectedTime, key, value) as Time,
      );
      setSecondDateIfNull();
    }

    setSelectedTime((prev) => getUpdatedTime(prev, key, value) as Time);
  }

  function setFirstDateIfNull() {
    if (!firstDate) {
      onFirstDateChange(startOfDay(new Date()));
    }
  }

  function setSecondDateIfNull() {
    if (!secondDate) {
      onSecondDateChange(startOfDay(new Date()));
    }
  }

  function getUpdatedTime(
    prev: Time | null,
    key: "hours" | "minutes",
    value: number,
  ) {
    const currentTime = prev || getDefaultSelectedTime();
    return { ...currentTime, [key]: value };
  }

  function handlePeriodChange(ampm: "AM" | "PM") {
    if (activeInput === ActiveInput.First) {
      onFirstSelectedTimeChange(getUpdatedPeriod(firstSelectedTime, ampm));
      setFirstDateIfNull();
    } else if (activeInput === ActiveInput.Second) {
      onSecondSelectedTimeChange(getUpdatedPeriod(secondSelectedTime, ampm));
      setSecondDateIfNull();
    }

    setSelectedTime((prev) => getUpdatedPeriod(prev, ampm));
  }

  function getUpdatedPeriod(prev: Time | null, ampm: "AM" | "PM") {
    const currentTime = prev || getDefaultSelectedTime();
    return { ...currentTime, ampm };
  }

  function convertTo2DigitString(num: number) {
    return num.toString().padStart(2, "0");
  }

  return (
    <div className="flex flex-col">
      <div className="flex overflow-hidden">
        <Selection
          items={hours}
          selectedItem={
            selectedTime ? convertTo2DigitString(selectedTime.hours) : ""
          }
          onSelect={(item) => handleTimeChange("hours", Number(item))}
          hasBorder
          testid="hours"
        />
        <Selection
          items={minutes}
          selectedItem={
            selectedTime ? convertTo2DigitString(selectedTime.minutes) : ""
          }
          onSelect={(item) => handleTimeChange("minutes", Number(item))}
          hasBorder
          testid="minutes"
        />
        <Selection
          items={periods}
          selectedItem={selectedTime ? selectedTime.ampm : ""}
          onSelect={(ampm) => handlePeriodChange(ampm as "AM" | "PM")}
          testid="periods"
        />
      </div>
    </div>
  );
}

export default TimePicker;
