import { isValid } from "date-fns";
import {
  KeyboardEvent,
  useEffect,
  useRef
} from "react";
import { Time } from "../types";

interface DateInputProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  time: Time | null;
  onTimeChange: (time: Time | null) => void;
  isInputValid: boolean;
  onIsInputValidChange: (isValid: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
}

interface Section {
  start: number;
  end: number;
  max: number;
  min?: number;
  name: string;
}

const sections: Section[] = [
  { start: 0, end: 2, max: 12, name: "MM" },
  { start: 3, end: 5, max: 31, name: "dd" },
  { start: 6, end: 10, max: 9999, name: "yyyy" },
  { start: 11, end: 13, max: 12, name: "hh" },
  { start: 14, end: 16, max: 59, min: 0, name: "mm" },
  { start: 17, end: 19, max: 2, name: "aa" },
];

const TIME_PLACEHOLDER = `${sections[3].name}:${sections[4].name} ${sections[5].name}`;
const DATE_PLACEHOLDER = `${sections[0].name}/${sections[1].name}/${sections[2].name}`;

function DateInput({
  date,
  time,
  onDateChange,
  onTimeChange,
  isInputValid,
  onIsInputValidChange,
  value,
  onValueChange,
}: DateInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const dateFromValue = queryDateFromValue();
    const timeFromValue = queryTimeFromValue();

    if (validateDate(dateFromValue)) {
      onDateChange(dateFromValue);
    } else {
      onDateChange(null);
    }

    if (timeFromValue) {
      onTimeChange(timeFromValue);
    } else {
      onTimeChange(null);
    }

    if (
      isValuePlaceholder() ||
      (timeFromValue && validateDate(dateFromValue))
    ) {
      onIsInputValidChange(true);
    } else {
      onIsInputValidChange(false);
    }
  }, [value]);

  function validateDate(date: Date | null) {
    return date && isValid(date);
  }

  function isValuePlaceholder() {
    const section = { start: sections[0].start, end: sections[5].end };
    const value = getSectionValue(section);
    return value === `${DATE_PLACEHOLDER} ${TIME_PLACEHOLDER}`;
  }

  function queryDateFromValue() {
    const month = parseInt(getSectionValue(sections[0]));
    const day = parseInt(getSectionValue(sections[1]));
    const year = parseInt(getSectionValue(sections[2]));

    if (year > 1899 && year < 2101) {
      return new Date(year, month - 1, day);
    }

    return null;
  }

  function queryTimeFromValue(): Time | null {
    const hours = parseInt(getSectionValue(sections[3]));
    const minutes = parseInt(getSectionValue(sections[4]));
    const ampm = getSectionValue(sections[5]) as "AM" | "PM";

    if (isTimeValid(hours, minutes, ampm)) {
      return { hours, minutes, ampm };
    }

    return null;
  }

  function getSectionValue({ start, end }: { start: number; end: number }) {
    return value.slice(start, end);
  }

  function isTimeValid(hours: number, minutes: number, ampm: string) {
    if (isNaN(hours) || isNaN(minutes)) {
      return false;
    } else if (hours < 1 || hours > 12) {
      return false;
    } else if (minutes < 0 || minutes > 59) {
      return false;
    } else if (ampm !== "AM" && ampm !== "PM") {
      return false;
    }
    return true;
  }

  useEffect(() => {
    changeDateInValue();
  }, [date]);

  function changeDateInValue() {
    const start = sections[0].start;
    const end = sections[2].end;
    if (date) {
      const dateValue = formatDate(date);
      updateValue({ start, end }, dateValue, getSameHighlight());
    } else {
      const dateValue = getSectionValue({ start, end });
      if (dateValue && !isInputValid) {
        updateValue({ start, end }, dateValue, getSameHighlight());
      } else {
        updateValue({ start, end }, DATE_PLACEHOLDER, getSameHighlight());
      }
    }
  }

  function formatDate(date: Date) {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(4, "0");
    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    changeTimeInValue();
  }, [time]);

  function changeTimeInValue() {
    const start = sections[3].start;
    const end = sections[5].end;
    if (time) {
      const timeValue = formatTime(time);
      updateValue({ start, end }, timeValue, getSameHighlight());
    } else {
      const timeValue = getSectionValue({ start, end });
      if (timeValue && !isInputValid) {
        updateValue({ start, end }, timeValue, getSameHighlight());
      } else {
        updateValue({ start, end }, " " + TIME_PLACEHOLDER, getSameHighlight());
      }
    }
  }

  function formatTime(time: Time) {
    const hours = time.hours.toString().padStart(2, "0");
    const minutes = time.minutes.toString().padStart(2, "0");
    return `${hours}:${minutes} ${time.ampm}`;
  }

  function getSameHighlight() {
    if (inputRef.current) {
      return {
        start: inputRef.current.selectionStart || 0,
        end: inputRef.current.selectionEnd || 0,
      };
    }
    return undefined;
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    e.preventDefault();
    const position = inputRef.current?.selectionStart || 0;
    const section = getSectionByPosition(position);

    if (section) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        adjustSectionValue(section, e.key === "ArrowUp");
      } else if (!isNaN(parseInt(e.key, 10))) {
        handleNumericKey(section, parseInt(e.key, 10));
      } else if (e.key.toLowerCase() === "a" || e.key.toLowerCase() === "p") {
        if (section === sections[5]) {
          toggleAMPM(e.key.toLowerCase());
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        changeHighlightedSection(
          sections.indexOf(section),
          e.key === "ArrowRight"
        );
      } else if (e.key === "Backspace") {
        eraseSection(section);
      }
    }
  }

  function eraseSection(section: Section) {
    updateValue(section, section.name);
  }

  function changeHighlightedSection(
    currentSectionIndex: number,
    isNext: boolean
  ) {
    const nextSectionIndex = isNext
      ? currentSectionIndex + 1
      : currentSectionIndex - 1;

    if (nextSectionIndex < 0 || nextSectionIndex > sections.length - 1) {
      return;
    }

    const nextSection = sections[nextSectionIndex];
    inputRef.current?.setSelectionRange(nextSection.start, nextSection.end);
  }

  function getSectionByPosition(position: number) {
    return sections.find((sec) => position >= sec.start && position <= sec.end);
  }

  function adjustSectionValue(section: Section, isIncrement: boolean) {
    const { start, end, max, min } = section;
    if (start === 17 && end === 19) {
      const isPM = value.slice(start, end) === "PM";
      toggleAMPM(isPM ? "a" : "p");
      return;
    }

    let currentValue = parseInt(value.slice(start, end)) || 0;
    currentValue = isIncrement ? currentValue + 1 : currentValue - 1;

    const minThreshold = min !== undefined ? min : 1;
    if (currentValue < minThreshold) {
      currentValue = max;
    }
    if (currentValue > max) {
      currentValue = minThreshold;
    }

    const pads = end - start;
    updateValue(section, currentValue.toString().padStart(pads, "0"));
  }

  function handleNumericKey(section: Section, numKey: number) {
    const { start, end, max } = section;
    let currentSectionValue = value.slice(start, end);
    let newSectionValue: string;
    let newHighlightedSection: Section;

    if (section === sections[2]) {
      newSectionValue = calculateNewSectionValueForYear(
        currentSectionValue,
        numKey
      );
      newHighlightedSection =
        calculateNewHighlightedSectionForYear(newSectionValue);
    } else {
      newSectionValue = calculateNewSectionValue(
        currentSectionValue,
        max,
        numKey,
        section === sections[4]
      );
      newHighlightedSection = calculateNewHighlightedSection(
        sections.indexOf(section),
        newSectionValue,
        max
      );
    }

    updateValue(section, newSectionValue, newHighlightedSection);
  }

  function calculateNewSectionValueForYear(
    currentSectionValue: string,
    numKey: number
  ) {
    if (currentSectionValue[0] !== "0") {
      return "000" + numKey.toString();
    } else {
      return (currentSectionValue + numKey).slice(-4);
    }
  }

  function calculateNewHighlightedSectionForYear(currentSectionValue: string) {
    if (currentSectionValue[0] === "0") {
      return sections[2];
    }

    return sections[3];
  }

  function calculateNewSectionValue(
    currentSectionValue: string,
    max: number,
    numKey: number,
    allowZero: boolean = false
  ) {
    const maxFirstDigit = parseInt(max.toString()[0]);
    const maxSecondDigit = parseInt(max.toString()[1]);
    const secondDigit = parseInt(currentSectionValue[1]);

    if (currentSectionValue[0] === "0") {
      if (
        secondDigit < maxFirstDigit ||
        (secondDigit === maxFirstDigit && numKey <= maxSecondDigit)
      ) {
        return currentSectionValue[1] + numKey.toString();
      }
    }

    if (!allowZero) {
      if (numKey === 0) {
        return currentSectionValue;
      }
    }

    return "0" + numKey.toString();
  }

  function calculateNewHighlightedSection(
    currentSectionIndex: number,
    currentSectionValue: string,
    max: number
  ) {
    const maxFirstDigit = parseInt(max.toString()[0]);
    const secondDigit = parseInt(currentSectionValue[1]);

    if (
      (currentSectionValue[0] === "0" && secondDigit <= maxFirstDigit) ||
      !parseInt(currentSectionValue)
    ) {
      return sections[currentSectionIndex];
    }

    return sections[currentSectionIndex + 1];
  }

  function toggleAMPM(key: string) {
    const newValue = key === "p" ? "PM" : "AM";
    updateValue(sections[5], newValue);
  }

  function updateValue(
    updatedSection: { start: number; end: number },
    newSectionValue: string | number,
    highlightSection?: { start: number; end: number }
  ) {
    const { start, end } = updatedSection;
    if (!inputRef.current) {
      return;
    }

    const { value } = inputRef.current;
    const updatedValue =
      value.slice(0, start) + newSectionValue + value.slice(end);

    updateInputValue(updatedValue, highlightSection || updatedSection);
    onValueChange(updatedValue);
  }

  function updateInputValue(
    newValue: string,
    highlight: { start: number; end: number }
  ) {
    if (inputRef.current) {
      inputRef.current.value = newValue;
      inputRef.current.setSelectionRange(highlight.start, highlight.end);
    }
  }

  function highlightSection() {
    if (!inputRef.current) return;
    const position = inputRef.current.selectionStart || 0;
    const section = getSectionByPosition(position);

    if (section) {
      inputRef.current.setSelectionRange(section.start, section.end);
    }
  }

  return (
    <input
      ref={inputRef}
      className="w-full h-full bg-transparent border-none hover:outline-none 
      outline-none z-10 pl-2"
      value={value}
      spellCheck={false}
      onChange={() => {}}
      onSelect={highlightSection}
      onKeyDown={handleKeyDown}
    />
  );
}

export default DateInput;
