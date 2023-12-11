import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { useDateTimeRange } from "../Calendar/DateTimeRangeProvider";
import { ActiveInput, Time } from "../types";
import { getDefaultSelectedTime, isTimeEqual } from "../utils";
import Selection from "./Selection";

const hours12 = Array.from({ length: 11 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
hours12.unshift("12");

const hours24 = Array.from({ length: 23 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
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
    useAMPM,
  } = useDateTimeRange();
  const [selectedTime, setSelectedTime] = useState<Time | null>(null);

  useEffect(() => {
    if (activeInput === ActiveInput.First) {
      setSelectedTime(firstSelectedTime);
    } else if (activeInput === ActiveInput.Second) {
      setSelectedTime(secondSelectedTime);
    }
  }, [activeInput, firstSelectedTime, secondSelectedTime]);

  useEffect(() => {
    if (!selectedTime) {
      return;
    }

    if (
      activeInput === ActiveInput.First &&
      !isTimeEqual(selectedTime, firstSelectedTime)
    ) {
      onFirstSelectedTimeChange(selectedTime);
    } else if (
      activeInput === ActiveInput.Second &&
      !isTimeEqual(selectedTime, secondSelectedTime)
    ) {
      onSecondSelectedTimeChange(selectedTime);
    }
  }, [selectedTime]);

  function handleTimeChange(key: string, value: number | string) {
    updateSelectedTime(key, value);
    setDateIfNotSet();
  }

  function setDateIfNotSet() {
    if (activeInput === ActiveInput.First && !firstDate) {
      onFirstDateChange(startOfDay(new Date()));
    } else if (activeInput === ActiveInput.Second && !secondDate) {
      onSecondDateChange(startOfDay(new Date()));
    }
  }

  function updateSelectedTime(key: string, value: number | string) {
    setSelectedTime((prev) => {
      if (prev) {
        return { ...prev, [key]: value } as Time;
      } else {
        return { ...getDefaultSelectedTime(useAMPM), [key]: value } as Time;
      }
    });
  }

  function convertTo2DigitString(num: number) {
    return num.toString().padStart(2, "0");
  }

  return (
    <div className="flex flex-col">
      <div className="flex overflow-hidden">
        <Selection
          items={useAMPM ? hours12 : hours24}
          selectedItem={
            selectedTime ? convertTo2DigitString(selectedTime.hours) : ""
          }
          onSelect={(item) => handleTimeChange("hours", parseInt(item))}
          hasBorder
          testid="hours"
        />
        <Selection
          items={minutes}
          selectedItem={
            selectedTime ? convertTo2DigitString(selectedTime.minutes) : ""
          }
          onSelect={(item) => handleTimeChange("minutes", parseInt(item))}
          hasBorder
          testid="minutes"
        />
        {useAMPM && (
          <Selection
            items={periods}
            selectedItem={selectedTime ? selectedTime.ampm : ""}
            onSelect={(ampm) => handleTimeChange("ampm", ampm)}
            testid="periods"
          />
        )}
      </div>
    </div>
  );
}

export default TimePicker;
