import DateTimeRange from "./DateTimeRange/DateTimeRange";
import "./index.css";

export default function App() {
    return (
        <div className="flex h-full pt-10 justify-center bg-sky-200">
            <DateTimeRange
                inputText={{ start: "Start date", end: "End date" }}
                useAMPM={true}
            />
        </div>
    );
}
