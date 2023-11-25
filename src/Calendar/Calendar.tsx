import { addMonths, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./Calendar.css";
import Cells from "./Cells";
import Days from "./Days";
import Header from "./Header";

const duration = 250;

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCurrentMonthNext, setIsCurrentMonthNext] = useState(true);
  const [cellsComponents, setCellsComponents] = useState<
    { id: number; element: JSX.Element; isNext: boolean }[]
  >([]);

  useEffect(() => {
    const id = new Date().getTime();
    const newComponent = {
      id,
      element: (
        <Cells currentMonth={currentMonth} key={currentMonth.toDateString()} />
      ),
      isNext: isCurrentMonthNext,
    };

    setCellsComponents([newComponent]);
  }, [currentMonth]);

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
