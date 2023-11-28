import Calendar from "../Calendar/Calendar";
import TimePicker from "../TimePicker/TimePicker";

export default function DateTimeRange() {
  return (
    <div className="flex flex-shrink-0 justify-center h-[330px] border 
    border-gray-400 rounded-md shadow-md bg-white">
      <Calendar />
      <TimePicker />
    </div>
  );
}
