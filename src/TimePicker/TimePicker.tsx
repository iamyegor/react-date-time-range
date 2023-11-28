import { useState } from "react";
import Selection from "./Selection";

// Optional: Extract constants
const hours = Array.from({ length: 11 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
hours.unshift("12");

const minutes = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0")
);
const periods = ["AM", "PM"];

function TimePicker() {
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  return (
    <div className="flex flex-col w-48">
      <div className="flex justify-between px-4 py-2 overflow-hidden">
        <Selection
          items={hours}
          selectedItem={selectedHour}
          setSelectedItem={setSelectedHour}
          testid="hours"
        />
        <Selection
          items={minutes}
          selectedItem={selectedMinute}
          setSelectedItem={setSelectedMinute}
          testid="minutes"
        />
        <Selection
          items={periods}
          selectedItem={selectedPeriod}
          setSelectedItem={setSelectedPeriod}
          testid="periods"
        />
      </div>
      <hr />
      <button
        className="py-2 text-lg"
        onClick={() =>
          alert(`${selectedHour}:${selectedMinute} ${selectedPeriod}`)
        }
      >
        OK
      </button>
    </div>
  );
}

export default TimePicker;
