import DateTimeRange from "./DateTimeRange/DateTimeRange";
import "./index.css";

export default function App() {
  const bannedDates = [
    new Date(2023, 11, 10),
    new Date(2023, 11, 11),
    new Date(2023, 11, 12),
  ];

  return (
    <div className="flex h-full pt-10 justify-center bg-sky-200">
      <DateTimeRange
        bannedDates={bannedDates}
        inputText={{ start: "Start date", end: "End date" }}
        useAMPM={false}
        minDate={new Date()}
      />
    </div>
  );
}
