import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

interface InputProps {
  text: string;
  date: Date | null;
  onFocus: () => void;
}

function DateInput({ text, date, onFocus }: InputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [textWidth, setTextWidth] = useState<number>(0);
  const [shouldRemoveHiddenText, setShouldRemoveHiddenText] =
    useState<boolean>(false);
  const hiddenTextRef = useRef<HTMLLabelElement>(null);

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

  function shouldKeepTextOnTop() {
    return isFocused || date;
  }

  const clipPath = shouldKeepTextOnTop()
    ? `polygon(10px 0, 10px 10%, ${textWidth + 14}px 10%, ${
        textWidth + 14
      }px 0, 100% 0, 100% 100%, 0 100%, 0 0)`
    : "";

  const inputClassNames = `rounded border flex items-center p-2
  focus:outline-none w-full h-full transition-colors border ${
    isFocused
      ? "border-blue-500 border-2"
      : "border-gray-700 group-hover:border-gray-400"
  }`;

  const textClassNames = `transition-all absolute left-0 ${
    shouldKeepTextOnTop()
      ? "left-3 -top-[0.725rem] text-xs"
      : "transform -translate-y-1/2 top-1/2 left-2 text-base"
  } ${isFocused ? "text-blue-500" : "text-gray-800"}`;

  function getInputText() {
    if (date) {
      return format(date, "dd/MM/yyyy");
    } else {
      if (shouldKeepTextOnTop()) {
        return "mm/dd/yyyy";``
      }
    }
  }

  return (
    <div
      className="relative group w-[15rem] h-10"
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className={inputClassNames} tabIndex={0} style={{ clipPath }}>
        <p className="transition-all">{getInputText()}</p>
      </div>
      <label className={textClassNames} tabIndex={0}>
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

export default DateInput;
