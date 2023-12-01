import { useRef, useState } from "react";
import CalendarProvider from "../Calendar/CalendarProvider";
import useOutsideClick from "../hooks/useOutsideClick";
import DateInput from "./DateInput";
import DateTime from "./DateTime";
import dashIcon from "../assets/icons/dash.svg";

export default function DateTimeRange() {
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isVisible: showDateTime, setIsVisible: setShowDateTime } =
    useOutsideClick(containerRef.current);

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-center">
        <DateInput
          text="Start Date"
          date={firstDate}
          onFocus={() => setShowDateTime(true)}
        />
        <img src={dashIcon} alt="dash" className="mx-2 w-[12px] h-[12px]" />
        <DateInput
          text="End Date"
          date={secondDate}
          onFocus={() => setShowDateTime(true)}
        />
      </div>
      <CalendarProvider
        firstDate={firstDate}
        secondDate={secondDate}
        setFirstDate={setFirstDate}
        setSecondDate={setSecondDate}
      >
        {showDateTime ? <DateTime /> : <></>}
      </CalendarProvider>
    </div>
  );
}
