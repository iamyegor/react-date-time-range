import Calendar from "./Calendar.tsx";
import TimePicker from "./TimePicker/TimePicker.tsx";
import OkButton from "./OkButton.tsx";

export default function DateTime() {
    return (
        <div
            className="border border-gray-400 rounded-md shadow-md bg-white 
      flex flex-col w-min"
            tabIndex={0}
            data-testid="date-time-picker"
        >
            <div className="flex h-[355px]">
                <Calendar />
                <TimePicker />
            </div>
            <hr />
            <OkButton>OK</OkButton>
        </div>
    );
}
