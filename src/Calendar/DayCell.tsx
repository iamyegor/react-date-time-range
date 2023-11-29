import { isEqual, isSameMonth } from "date-fns";
import { ReactElement } from "react";
import { DraggedDate } from "../types";
import { useCalendar } from "./CalendarProvider";
import EmptyCell from "./EmptyCell";
import FilledCell from "./FilledCell";
import "./styles/DayCell.css";

interface DayCellProps {
  day: Date;
  currentMonth: Date;
  firstDate: Date | null;
  secondDate: Date | null;
  onHover: (day: Date | null) => void;
}

function DayCell({
  day,
  currentMonth,
  firstDate,
  secondDate,
  onHover,
}: DayCellProps): ReactElement {
  const { setDraggedDate } = useCalendar();

  if (!isSameMonth(day, currentMonth)) {
    return <EmptyCell />;
  }

  return (
    <FilledCell
      day={day}
      onMouseEnter={() => onHover(day)}
      onMouseLeave={() => onHover(null)}
      handleDateDrag={() => {
        if (firstDate && isEqual(firstDate, day)) {
          console.log(setDraggedDate);
          setDraggedDate(DraggedDate.First);
        } else if (secondDate && isEqual(secondDate, day)) {
          setDraggedDate(DraggedDate.Second);
        }
      }}
      handleDateRelease={() => setDraggedDate(DraggedDate.None)}
    />
  );
}

export default DayCell;
