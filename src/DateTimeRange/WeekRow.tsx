import { addDays, isSameMonth } from "date-fns";
import { ReactElement } from "react";
import EmptyCell from "./cells/EmptyCell.tsx";
import FilledCell from "./cells/FilledCell.tsx";

interface WeekRowProps {
    startOfWeek: Date;
    currentMonth: Date;
}

const DAYS_IN_A_WEEK = 7;

function WeekRow({ startOfWeek, currentMonth }: WeekRowProps): ReactElement {
    let days: ReactElement[] = [];
    let currentDay = startOfWeek;

    for (let i = 0; i < DAYS_IN_A_WEEK; i++) {
        days.push(
            isSameMonth(currentDay, currentMonth) ? (
                <FilledCell key={currentDay.toDateString()} day={currentDay} />
            ) : (
                <EmptyCell key={currentDay.toDateString()} />
            ),
        );
        currentDay = addDays(currentDay, 1);
    }

    return (
        <div className="flex" key={startOfWeek.toDateString()}>
            {days}
        </div>
    );
}

export default WeekRow;
