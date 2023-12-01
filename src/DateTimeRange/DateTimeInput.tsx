import { useEffect, useState, useRef } from "react";
import DateInput from "./DateInput";
import DateTime from "./DateTime";
import CalendarProvider from "../Calendar/CalendarProvider";

export default function DateTimeInput() {
  const [showDateTime, setShowDateTime] = useState<boolean>(false);
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dateInputRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setShowDateTime(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <CalendarProvider firstDate={firstDate} setFirstDate={setFirstDate}>
      <div ref={containerRef} className="relative flex flex-col items-center">
        <div ref={dateInputRef}>
          <DateInput
            date={firstDate}
            onFocus={() => setShowDateTime(true)}
            text={"Start date"}
            keepTextOnTop={showDateTime}
          />
        </div>
        {showDateTime && (
          <div
            style={{
              position: "absolute",
              top: `${dateInputRef.current?.offsetHeight}px`,
              marginTop: "0.5rem",
              zIndex: 99,
            }}
          >
            <DateTime />
          </div>
        )}
      </div>
    </CalendarProvider>
  );
}
