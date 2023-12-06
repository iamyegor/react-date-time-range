import { Dispatch, KeyboardEvent, SetStateAction, useRef } from "react";

interface DateInputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

interface Section {
  start: number;
  end: number;
  max: number;
  min?: number;
}

const sections: Section[] = [
  { start: 0, end: 2, max: 12 }, // MM
  { start: 3, end: 5, max: 31 }, // dd
  { start: 6, end: 10, max: 9999 }, // yyyy
  { start: 11, end: 13, max: 12 }, // hh
  { start: 14, end: 16, max: 59, min: 0 }, // mm
  { start: 17, end: 19, max: 2 }, // aa
];

const DateInput: React.FC<DateInputProps> = ({ value, setValue }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      }
    }
  }

  function changeHighlightedSection(
    currentSectionIndex: number,
    isNext: boolean
  ) {
    const nextSectionIndex = isNext
      ? currentSectionIndex + 1
      : currentSectionIndex - 1;
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
        numKey
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
    numKey: number
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

    return numKey === 0 ? currentSectionValue : "0" + numKey.toString();
  }

  function calculateNewHighlightedSection(
    currentSectionIndex: number,
    currentSectionValue: string,
    max: number
  ) {
    const maxFirstDigit = parseInt(max.toString()[0]);
    const secondDigit = parseInt(currentSectionValue[1]);

    if (currentSectionValue[0] === "0") {
      if (secondDigit <= maxFirstDigit) {
        return sections[currentSectionIndex];
      }
    }

    return sections[currentSectionIndex + 1];
  }

  function toggleAMPM(key: string) {
    const newValue = key === "p" ? "PM" : "AM";
    updateValue(sections[5], newValue);
  }

  function updateValue(
    updatedSection: Section,
    newSectionValue: string | number,
    focusSection?: Section
  ) {
    const { start, end } = updatedSection;
    const updatedValue =
      value.slice(0, start) + newSectionValue + value.slice(end);

    updateInputValue(updatedValue, focusSection || updatedSection);
    setValue(updatedValue);
  }

  function updateInputValue(newValue: string, section: Section) {
    if (inputRef.current) {
      inputRef.current.value = newValue;
      inputRef.current.setSelectionRange(section.start, section.end);
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
      onSelect={highlightSection}
      onKeyDown={handleKeyDown}
    />
  );
};

export default DateInput;
