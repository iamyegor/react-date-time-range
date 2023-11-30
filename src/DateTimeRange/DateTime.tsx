import Calendar from "../Calendar/Calendar";
import CalendarProvider from "../Calendar/CalendarProvider";
import TimePicker from "../TimePicker/TimePicker";

export default function DateTime() {
  return (
    <div
      className="flex flex-shrink-0 justify-center border 
    border-gray-400 rounded-md shadow-md bg-white h-[360px]"
      style={{ userSelect: "none" }}
    >
      <CalendarProvider>
        <Calendar />
      </CalendarProvider>
      <TimePicker />
    </div>
  );
}
