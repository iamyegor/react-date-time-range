import DateTimeRange from "./DateTimeRange/DateTimeRange";
import "./index.css";

export default function App() {

  return (
    <div className="flex h-full pt-10 justify-center bg-sky-200">
      <DateTimeRange
        inputText={{ start: "Start date", end: "End date" }}
        useAMPM={true}
        minDate={new Date(2023, 11, 12)}
        maxDate={new Date(2023, 11, 20)}
        minTime={new Date(2023, 11, 12, 7, 23)}
      />
    </div>
  );
}
