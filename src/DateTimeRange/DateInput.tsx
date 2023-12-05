import { Dispatch, KeyboardEvent, SetStateAction, useRef } from "react";

interface DateInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const sections = [
  { start: 0, end: 2 }, // MM
  { start: 3, end: 5 }, // dd
  { start: 6, end: 10 }, // yyyy
  { start: 11, end: 13 }, // hh
  { start: 14, end: 16 }, // mm
  { start: 17, end: 19 }, // aa
];

export default function DateInput({ value, setValue }: DateInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const position = inputRef.current?.selectionStart || 0;

    if (position >= 17 && position <= 19) {
      handleAMPMChange(e.key);
    }

    if (e.key === "ArrowUp") {
      if (position <= 2) {
        incrementSection(sections[0], 12);
      } else if (position >= 3 && position <= 5) {
        incrementSection(sections[1], 31);
      } else if (position >= 6 && position <= 10) {
        incrementSection(sections[2], 9999);
      } else if (position >= 11 && position <= 13) {
        incrementSection(sections[3], 12);
      } else if (position >= 14 && position <= 16) {
        incrementSection(sections[4], 59, 0);
      } else if (position >= 17 && position <= 19) {
        toggleAMPM();
      }
    } else if (e.key === "ArrowDown") {
      if (position <= 2) {
        decrementSection(sections[0], 1, 12);
      } else if (position >= 3 && position <= 5) {
        decrementSection(sections[1], 1, 31);
      } else if (position >= 6 && position <= 10) {
        decrementSection(sections[2], 1, 9999);
      } else if (position >= 11 && position <= 13) {
        decrementSection(sections[3], 1, 12);
      } else if (position >= 14 && position <= 16) {
        decrementSection(sections[4], 0, 59);
      } else if (position >= 17 && position <= 19) {
        toggleAMPM();
      }
    }

    function decrementSection(
      { start, end }: { start: number; end: number },
      min: number,
      max: number
    ) {
      const num = getCurrentNumOrDefault(value.slice(start, end), min);

      const newNum = num - 1;

      let newSection = "";
      if (newNum < min) {
        max = max !== undefined ? max : 1;
        newSection = convertToStringWithPads(max, end - start);
      } else {
        newSection = convertToStringWithPads(newNum, end - start);
      }

      setNewSection(newSection, start, end);
    }

    const numKey = parseInt(e.key);
    if (isNaN(numKey) || numKey < 0 || numKey > 9) {
      return;
    }

    if (position <= 2) {
      handleMonthChange(numKey);
    } else if (position >= 3 && position <= 5) {
      handleDayChange(numKey);
    } else if (position >= 6 && position <= 10) {
      handleYearChange(numKey);
    } else if (position >= 11 && position <= 13) {
      handleHourChange(numKey);
    } else if (position >= 14 && position <= 16) {
      handleMinuteChange(numKey);
    }
  }

  function handleMonthChange(numKey: number) {
    const month = changeMonthBasedOnKey(value.slice(0, 2), numKey);
    const newValue = month + value.slice(2);
    updateInputValueAndCaretPos(newValue, getPosBasedOnMonth(month));
    setValue(newValue);
  }

  function changeMonthBasedOnKey(mm: string, numKey: number) {
    if (mm === "01") {
      return numKey > 2 ? "0" + numKey : "1" + numKey;
    }
    return "0" + numKey;
  }

  function getPosBasedOnMonth(month: string) {
    if (month === "01") {
      return sections[0];
    }
    return sections[1];
  }

  function handleDayChange(numKey: number) {
    const day = changeDayBasedOnKey(value.slice(3, 5), numKey);
    const newValue = value.slice(0, 3) + day + value.slice(5);
    updateInputValueAndCaretPos(newValue, getPosBasedOnDay(day));
    setValue(newValue);
  }

  function changeDayBasedOnKey(dd: string, numKey: number) {
    if (dd === "02" || dd === "01") {
      return dd[1] + numKey;
    } else if (dd === "03") {
      return numKey > 1 ? "0" + numKey : "3" + numKey;
    } else {
      return "0" + numKey;
    }
  }

  function getPosBasedOnDay(day: string) {
    if (day === "02" || day === "01" || day === "03") {
      return sections[1];
    }
    return sections[2];
  }

  function handleYearChange(numKey: number) {
    const year = changeYearBasedOnKey(value.slice(6, 10), numKey);
    const newValue = value.slice(0, 6) + year + value.slice(10);
    updateInputValueAndCaretPos(newValue, getPosBasedOnYear(year));
    setValue(newValue);
  }

  function changeYearBasedOnKey(yyyy: string, numKey: number) {
    if (yyyy[0] === "0" || yyyy[0] === "y") {
      return yyyy.substring(1) + numKey;
    } else {
      return "000" + numKey;
    }
  }

  function getPosBasedOnYear(year: string) {
    if (year[0] === "0" || year[0] === "y") {
      return sections[2];
    }
    return sections[3];
  }

  function handleHourChange(numKey: number) {
    const hour = changeHourBasedOnKey(value.slice(11, 13), numKey);
    const newValue = value.slice(0, 11) + hour + value.slice(13);
    updateInputValueAndCaretPos(newValue, getPosBasedOnHour(hour));
    setValue(newValue);
  }

  function changeHourBasedOnKey(hh: string, numKey: number) {
    if (hh === "01") {
      return "1" + numKey;
    } else {
      return "0" + numKey;
    }
  }

  function getPosBasedOnHour(hour: string) {
    if (hour === "01") {
      return sections[3];
    }
    return sections[4];
  }

  function handleMinuteChange(numKey: number) {
    const minute = changeMinuteBasedOnKey(value.slice(14, 16), numKey);
    const newValue = value.slice(0, 14) + minute + value.slice(16);
    updateInputValueAndCaretPos(newValue, getPosBasedOnMinute(minute));
    setValue(newValue);
  }

  function changeMinuteBasedOnKey(mm: string, numKey: number) {
    if (mm[0] === "0" && parseInt(mm[1]) < 6) {
      return mm[1] + numKey;
    } else {
      return "0" + numKey;
    }
  }

  function getPosBasedOnMinute(minute: string) {
    if (minute[0] === "0" && parseInt(minute[1]) < 6) {
      return sections[4];
    }
    return sections[5];
  }

  function handleAMPMChange(key: string) {
    let newValue = "";

    if (key === "p") {
      newValue = value.slice(0, 17) + "PM";
    } else if (key === "a") {
      newValue = value.slice(0, 17) + "AM";
    } else {
      return;
    }

    updateInputValueAndCaretPos(newValue, sections[5]);
    setValue(newValue);
  }

  function updateInputValueAndCaretPos(
    newValue: string,
    { start, end }: { start: number; end: number }
  ) {
    if (inputRef.current) {
      inputRef.current.value = newValue;
      inputRef.current.setSelectionRange(start, end);
    }
  }

  function incrementSection(
    { start, end }: { start: number; end: number },
    max: number,
    min?: number
  ) {
    const num = getCurrentNumOrDefault(value.slice(start, end), min);

    const newNum = num + 1;

    let newSection = "";
    if (newNum > max) {
      min = min !== undefined ? min : 1;
      newSection = convertToStringWithPads(min, end - start);
    } else {
      newSection = convertToStringWithPads(newNum, end - start);
    }

    setNewSection(newSection, start, end);
  }

  function getCurrentNumOrDefault(section: string, min?: number) {
    let num = parseInt(section);
    if (isNaN(num)) {
      num = min !== undefined ? min - 1 : 0;
    }
    return num;
  }

  function convertToStringWithPads(number: number, sectionLength: number) {
    return number.toString().padStart(sectionLength, "0");
  }

  function setNewSection(section: string, start: number, end: number) {
    const newValue = value.slice(0, start) + section + value.slice(end);
    updateInputValueAndCaretPos(newValue, { start, end });
    setValue(newValue);
  }

  function toggleAMPM() {
    const AMPM = value.slice(17);
    if (AMPM === "AM") {
      handleAMPMChange("p");
    } else {
      handleAMPMChange("a");
    }
  }

  function highlightSection() {
    if (!inputRef.current) return;

    const position = inputRef.current.selectionStart || 0;

    const section = sections.find(
      (sec) => position >= sec.start && position <= sec.end
    );
    if (section) {
      inputRef.current.setSelectionRange(section.start, section.end);
    }
  }

  return (
    <input
      ref={inputRef}
      className="w-full h-full bg-transparent border-none hover:outline-none outline-none z-10 pl-2"
      value={value}
      onSelect={highlightSection}
      onKeyDown={handleKeyDown}
    />
  );
}
