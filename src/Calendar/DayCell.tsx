import { isSameMonth } from "date-fns";
import { ReactElement } from "react";
import EmptyCell from "./EmptyCell";
import FilledCell from "./FilledCell";
import "./styles/DayCell.css";

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  onHover: (day: Date | null) => void;
}

function DayCell({ day, currentMonth, onHover }: DayCellProps): ReactElement {
  if (!isSameMonth(day, currentMonth)) {
    return <EmptyCell />;
  }

  return (
    <FilledCell
      day={day}
      onMouseEnter={() => onHover(day)}
      onMouseLeave={() => onHover(null)}
    />
  );
}

export default DayCell;
