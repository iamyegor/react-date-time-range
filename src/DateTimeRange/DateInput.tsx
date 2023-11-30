import { useEffect, useRef, useState } from "react";

interface InputProps {
  text: string;
}

function Input(props: InputProps) {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [textWidth, setTextWidth] = useState<number>(0);
  const [shouldRemoveHiddenText, setShouldRemoveHiddenText] =
    useState<boolean>(false);
  const hiddenTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (hiddenTextRef.current) {
      const width = hiddenTextRef.current.offsetWidth;
      setTextWidth(width);
      setShouldRemoveHiddenText(true);
    }
  }, []);

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    setIsFocused(false);
  }

  const clipPath = isFocused
    ? `polygon(10px 0, 10px 10%, ${textWidth + 14}px 10%, ${
        textWidth + 14
      }px 0, 100% 0, 100% 100%, 0 100%, 0 0)`
    : "";

  const inputClassNames = `rounded border border-gray-400 text-white 
    focus:outline-none w-[15rem] h-10 transition-colors ${
      isFocused ? "border-blue-500 border-2" : "group-hover:border-white"
    }`;

  const textClassNames = `transition-all absolute left-0 ${
    isFocused
      ? "left-3 -top-[0.725rem] text-xs"
      : "transform -translate-y-1/2 top-1/2 left-2 text-base"
  }`;

  return (
    <div className="relative group" onFocus={handleFocus} onBlur={handleBlur}>
      <div className={inputClassNames} tabIndex={0} style={{ clipPath }}></div>
      <p className={textClassNames} tabIndex={0}>
        {props.text}
      </p>
      {!shouldRemoveHiddenText && (
        <p
          className="absolute left-2 -top-[0.725rem] text-xs collapse"
          tabIndex={0}
          aria-label="hidden"
          ref={hiddenTextRef}
        >
          {props.text}
        </p>
      )}
    </div>
  );
}

export default Input;
