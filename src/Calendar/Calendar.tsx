import { addMonths, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useCalendar } from "./CalendarProvider";
import Cells from "./Cells";
import Days from "./Days";
import Header from "./Header";
import "./styles/Calendar.css";

const duration = 250;

function Calendar() {
  const { currentMonth, setCurrentMonth, isDragging, setIsDragging } =
    useCalendar();
  const [isNext, setIsNext] = useState(true);
  const [cellsComponents, setCellsComponents] = useState<
    { id: string; element: JSX.Element; isNext: boolean }[]
  >([]);
  const [shouldApplyTransition, setShouldApplyTransition] = useState(false);

  useEffect(() => {
    if (!shouldApplyTransition && cellsComponents.length === 1) {
      setShouldApplyTransition(true);
    }
  }, [cellsComponents]);

  useEffect(() => {
    const key = currentMonth.toDateString();

    const newComponent = {
      id: key,
      element: <Cells currentMonth={currentMonth} key={key} />,
      isNext: isNext,
    };

    setCellsComponents([newComponent]);
  }, [currentMonth]);

  function onPrevMonthClick() {
    setCurrentMonth(subMonths(currentMonth, 1));
    setIsNext(false);
  }

  function onNextMonthClick() {
    setCurrentMonth(addMonths(currentMonth, 1));
    setIsNext(true);
  }

  return (
    <div
      className={`font-sans w-[360px] h-full p-4 border-r 
    overflow-hidden ${isDragging ? "cursor-grabbing" : ""}`}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <Header
        currentMonth={currentMonth}
        onPrevMonthClick={onPrevMonthClick}
        onNextMonthClick={onNextMonthClick}
      />
      <Days currentMonth={currentMonth} />
      <TransitionGroup className={"relative"}>
        {cellsComponents.map((cell) => (
          <CSSTransition
            timeout={duration}
            classNames={
              !shouldApplyTransition
                ? ""
                : `${isNext ? "slide-next" : "slide-prev"}`
            }
            key={cell.id}
          >
            <div className="absolute top-0 w-full z-10">{cell.element}</div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

export default Calendar;
