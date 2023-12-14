import { isValid } from "date-fns";
import { KeyboardEvent, useEffect, useRef } from "react";
import { useDateTimeRange } from "../Calendar/DateTimeRangeProvider";
import {
  DATE_PLACEHOLDER,
  TIME_PLACEHOLDER_24,
  TIME_PLACEHOLDER_AMPM,
  getDateTimePlaceholder,
  sections,
} from "../globals";
import { Section, Time } from "../types";

interface DateTimeInputProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  time: Time | null;
  onTimeChange: (time: Time | null) => void;
  value: string;
  onValueChange: (value: string) => void;
  isDateInvalid: boolean;
  onIsDateInvalidChange: (isInvalid: boolean) => void;
  isTimeInvalid: boolean;
  onIsTimeInvalidChange: (isInvalid: boolean) => void;
}

function DateTimeInput({
  isTimeInvalid,
  onIsTimeInvalidChange,
  isDateInvalid,
  onIsDateInvalidChange,
  date,
  time,
  onDateChange,
  onTimeChange,
  value,
  onValueChange,
}: DateTimeInputProps) {
  const { useAMPM } = useDateTimeRange();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const dateFromValue = queryDateFromValue();
    const timeFromValue = queryTimeFromValue();

    if (validateDate(dateFromValue)) {
      onDateChange(dateFromValue);
      onIsDateInvalidChange(false);
    } else {
      onDateChange(null);
      onIsDateInvalidChange(!isValuePlaceholder());
    }

    if (timeFromValue) {
      onTimeChange(timeFromValue);
      onIsTimeInvalidChange(false);
    } else {
      onTimeChange(null);
      onIsTimeInvalidChange(!isValuePlaceholder());
    }
  }, [value]);

  function validateDate(date: Date | null) {
    return date && isValid(date);
  }

  function isValuePlaceholder() {
    const section = { start: sections[0].start, end: sections[5].end };
    const value = getSectionValue(section);
    return value === getDateTimePlaceholder(useAMPM);
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

  function queryTimeFromValue() {
    const hours = parseInt(getSectionValue(sections[3]));
    const minutes = parseInt(getSectionValue(sections[4]));
    const ampm = useAMPM ? getSectionValue(sections[5]) : "24";

    if (isTimeValid(hours, minutes, ampm)) {
      return { hours, minutes, ampm } as Time;
    }

    return null;
  }

  function getSectionValue({ start, end }: { start: number; end: number }) {
    return value.slice(start, end);
  }

  function isTimeValid(hours: number, minutes: number, ampm: string) {
    if (ampm === "24") {
      return !(
        isNaN(hours) ||
        isNaN(minutes) ||
        hours > 23 ||
        hours < 1 ||
        minutes < 0 ||
        minutes > 59
      );
    } else {
      return !(
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 1 ||
        hours > 12 ||
        minutes < 0 ||
        minutes > 59 ||
        (ampm !== "AM" && ampm !== "PM")
      );
    }
  }

  useEffect(() => {
    changeDateInValue();
  }, [date]);

  function changeDateInValue() {
    const start = sections[0].start;
    const end = sections[2].end;
    const newDateValue = calculateNewDateValue({ start, end });
    updateValue({ start, end }, newDateValue, getSameHighlight());
  }

  function calculateNewDateValue(section: { start: number; end: number }) {
    if (date) {
      return formatDate(date);
    } else {
      const dateValue = getSectionValue(section);
      if (dateValue && isDateInvalid) {
        return dateValue;
      } else {
        return DATE_PLACEHOLDER;
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
    updateTimeInValue();
  }, [time]);

  function updateTimeInValue(): void {
    const sectionStart = sections[3].start;
    const sectionEnd = useAMPM ? sections[5].end : sections[4].end;
    const formattedTime = getFormattedTime(sectionStart, sectionEnd);

    updateValueWithTime(sectionStart, sectionEnd, formattedTime);
  }

  function getFormattedTime(start: number, end: number) {
    return useAMPM
      ? getFormattedTimeAMPM(start, end)
      : getFormattedTime24(start, end);
  }

  function getFormattedTime24(start: number, end: number) {
    return time
      ? formatTime24(time)
      : getTimeValueOrDefault(start, end, TIME_PLACEHOLDER_24);
  }

  function getFormattedTimeAMPM(start: number, end: number) {
    return time
      ? formatTimeAM(time)
      : getTimeValueOrDefault(start, end, TIME_PLACEHOLDER_AMPM);
  }

  function getTimeValueOrDefault(
    start: number,
    end: number,
    placeholder: string
  ) {
    const timeValue = getSectionValue({ start, end });
    return timeValue && isTimeInvalid ? timeValue : placeholder;
  }

  function updateValueWithTime(start: number, end: number, timeValue: string) {
    const shouldAddSpace = value.slice(start - 1, start) !== " ";
    const spaceOrEmpty = shouldAddSpace ? " " : "";
    const newValue = `${spaceOrEmpty}${timeValue}`;

    updateValue({ start, end }, newValue, getSameHighlight());
  }

  function formatTime24(time: Time) {
    return formatTime(time, "");
  }

  function formatTimeAM(time: Time) {
    return formatTime(time, ` ${time.ampm}`);
  }

  function formatTime(time: Time, suffix: string) {
    const hours = time.hours.toString().padStart(2, "0");
    const minutes = time.minutes.toString().padStart(2, "0");
    return `${hours}:${minutes}${suffix}`;
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
        handleAMPMKey(section, e.key.toLowerCase());
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const isNext = e.key === "ArrowRight";
        changeHighlightedSection(sections.indexOf(section), isNext);
      } else if (e.key === "Backspace") {
        eraseSection(section);
      }
    }
  }

  function handleAMPMKey(section: Section, key: string) {
    if (section === sections[5]) {
      toggleAMPM(key);
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

    const sectionsLength = useAMPM ? sections.length - 1 : sections.length - 2;
    if (nextSectionIndex < 0 || nextSectionIndex > sectionsLength) {
      return;
    }

    const nextSection = sections[nextSectionIndex];
    inputRef.current?.setSelectionRange(nextSection.start, nextSection.end);
  }

  function getSectionByPosition(position: number) {
    return sections.find((sec) => position >= sec.start && position <= sec.end);
  }

  function adjustSectionValue(section: Section, isIncrement: boolean) {
    const { start, end, min } = section;

    if (start === 17 && end === 19) {
      const isPM = value.slice(start, end) === "PM";
      toggleAMPM(isPM ? "a" : "p");
      return;
    }

    let currentValue = parseInt(value.slice(start, end)) || 0;
    currentValue = isIncrement ? currentValue + 1 : currentValue - 1;

    const minThreshold = min !== undefined ? min : 1;
    const maxThreshold = getMaxThreshold(section);
    if (currentValue < minThreshold) {
      currentValue = maxThreshold;
    }
    if (currentValue > maxThreshold) {
      currentValue = minThreshold;
    }

    const pads = end - start;
    updateValue(section, currentValue.toString().padStart(pads, "0"));
  }

  function getMaxThreshold(section: Section) {
    if (section === sections[3]) {
      return useAMPM ? 12 : 23;
    }

    return section.max;
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

export default DateTimeInput;
