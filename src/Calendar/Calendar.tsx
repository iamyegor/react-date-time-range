import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import "./Calendar.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface GetClassesForDayProps {
  day: Date;
  currentMonth: Date;
}

function getClassesForDay({
  day,
  currentMonth,
}: GetClassesForDayProps): string {
  const monthStart = startOfMonth(currentMonth);
  const dayIsSameMonth = isSameMonth(day, monthStart);
  const dayIsToday = isSameDay(day, new Date());

  if (!dayIsSameMonth) return "text-gray-400";
  if (dayIsToday) return "bg-blue-500 text-white rounded-full";
  return "text-gray-700";
}

interface HeaderProps {
  currentMonth: Date;
  onPrevMonthClick: () => void;
  onNextMonthClick: () => void;
}

function Header({
  currentMonth,
  onPrevMonthClick,
  onNextMonthClick,
}: HeaderProps) {
  const dateFormat = "MMMM yyyy";
  return (
    <div className="flex justify-between items-center py-2 px-4">
      <div className="cursor-pointer" onClick={onPrevMonthClick}>
        &lt;
      </div>
      <div>
        <span>{format(currentMonth, dateFormat)}</span>
      </div>
      <div className="cursor-pointer" onClick={onNextMonthClick}>
        &gt;
      </div>
    </div>
  );
}

interface DaysProps {
  currentMonth: Date;
}

function Days({ currentMonth }: DaysProps) {
  const days = useMemo(() => {
    const dateFormat = "EEEEEE";
    const startDate = startOfWeek(currentMonth);
    return [...Array(7)].map((_, i) => (
      <div
        className="flex-1 py-2 text-center uppercase font-semibold text-sm"
        key={i}
      >
        {format(addDays(startDate, i), dateFormat)}
      </div>
    ));
  }, [currentMonth]);

  return <div className="flex">{days}</div>;
}

interface CellsProps {
  currentMonth: Date;
}

function Cells({ currentMonth }: CellsProps) {
  const rows = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    let days = [];
    let day = startDate;

    const rows = [];
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        days.push(
          <div
            className="flex-1 py-1 flex justify-center items-center"
            key={day.toDateString()}
          >
            <div
              className={`w-9 h-9 flex items-center justify-center 
              ${getClassesForDay({ day, currentMonth })}`}
            >
              <span>{formattedDate}</span>
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="flex" key={day.toDateString()}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  }, [currentMonth]);

  return <div className="flex-shrink-0 w-full">{rows}</div>;
}

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cellsComponents, setCellsComponents] = useState<
    { id: number; element: JSX.Element }[]
  >([]);
  console.log(cellsComponents);

  useEffect(() => {
    const id = new Date().getTime();
    const newComponent = {
      id,
      element: (
        <Cells currentMonth={currentMonth} key={currentMonth.toDateString()} />
      ),
    };

    setCellsComponents((prev) => [...prev, newComponent]);

    if (cellsComponents.length > 0) {
      setTimeout(() => {
        setCellsComponents((prevComponents) =>
          prevComponents.length > 0 ? prevComponents.slice(1) : []
        );
      }, 200);
    }
  }, [currentMonth]);

  function onPrevMonthClick() {
    setCurrentMonth(subMonths(currentMonth, 1));
  }

  function onNextMonthClick() {
    setCurrentMonth(addMonths(currentMonth, 1));
  }

  return (
    <div className="calendar font-sans border border-gray-300 max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
      <Header
        currentMonth={currentMonth}
        onPrevMonthClick={onPrevMonthClick}
        onNextMonthClick={onNextMonthClick}
      />
      <div className="relative overflow-hidden w-full h-[255px]">
        <div>
          <Days currentMonth={currentMonth} />
          <TransitionGroup>
            <div className="flex ">
              {cellsComponents.map((cell) => (
                <CSSTransition
                  key={cell.id}
                  timeout={500}
                  classNames={"my-component"}
                >
                  {cell.element}
                </CSSTransition>
              ))}
            </div>
          </TransitionGroup>
          {/* <Cells currentMonth={currentMonth} /> */}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
