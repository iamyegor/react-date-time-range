import Calendar from "../Calendar/Calendar";
import TimePicker from "../TimePicker/TimePicker";
import OKButton from "./OKButton";
import "./styles/DateTime.css";

interface DateTimeProps {
  onOkButtonClick: () => void;
}

export default function DateTime({ onOkButtonClick }: DateTimeProps) {
  return (
    <div
      className="border border-gray-400 rounded-md shadow-md bg-white flex flex-col"
      tabIndex={0}
    >
      <div className="flex h-[355px]">
        <Calendar />
        <TimePicker />
      </div>
      <hr />
      <OKButton onClick={() => onOkButtonClick()}>OK</OKButton>
    </div>
  );
}
