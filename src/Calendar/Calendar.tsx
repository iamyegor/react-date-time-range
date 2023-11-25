import { addMonths, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Cells from "./Cells";
import Days from "./Days";
import Header from "./Header";
import "./styles/Calendar.css";

const duration = 250;

function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCurrentMonthNext, setIsCurrentMonthNext] = useState(true);
  const [cellsComponents, setCellsComponents] = useState<
    { id: string; element: JSX.Element; isNext: boolean }[]
  >([]);

  useEffect(() => {
    const key = currentMonth.toDateString();

    const newComponent = {
      id: key,
      element: (
        <Cells
          currentMonth={currentMonth}
          key={key}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      ),
      isNext: isCurrentMonthNext,
    };

    setCellsComponents([newComponent]);
  }, [currentMonth, selectedDate]);

  function handleDateSelect(day: Date) {
    setSelectedDate(day);
  }

  function onPrevMonthClick() {
    setCurrentMonth(subMonths(currentMonth, 1));
    setIsCurrentMonthNext(false);
  }

  function onNextMonthClick() {
    setCurrentMonth(addMonths(currentMonth, 1));
    setIsCurrentMonthNext(true);
  }

  return (
    <div
      className="calendar font-sans border border-gray-300 max-w-xs 
    mx-auto rounded-lg overflow-hidden shadow-lg h-[300px] p-4 box-content"
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
            classNames={`${isCurrentMonthNext ? "slide-next" : "slide-prev"}`}
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
