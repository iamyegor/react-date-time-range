import classNames from "classnames";
import Calendar from "../Calendar/Calendar";
import CalendarProvider from "../Calendar/CalendarProvider";
import TimePicker from "../TimePicker/TimePicker";

export default function DateTime({ className }: { className?: string }) {
  const classes = classNames(
    `flex flex-shrink-0 justify-center border 
    border-gray-400 rounded-md shadow-md bg-white h-[360px]`,
    className
  );
  return (
    <div className={classes} style={{ userSelect: "none" }} tabIndex={0}>
      <CalendarProvider>
        <Calendar />
      </CalendarProvider>
      <TimePicker />
    </div>
  );
}
