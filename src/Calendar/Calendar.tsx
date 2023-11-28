import { addMonths, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Cells from "./Cells";
import Days from "./Days";
import Header from "./Header";
import "./styles/Calendar.css";

const duration = 250;

function Calendar() {
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isNext, setIsNext] = useState(true);
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
          firstDate={firstDate}
          secondDate={secondDate}
          handleFirstDateSelect={handleFirstDateSelect}
          handleSecondDateSelect={handleSecondDateSelect}
        />
      ),
      isNext: isNext,
    };

    setCellsComponents([newComponent]);
  }, [currentMonth, firstDate, secondDate]);

  function handleFirstDateSelect(day: Date) {
    setFirstDate(day);
  }

  function handleSecondDateSelect(day: Date) {
    setSecondDate(day);
  }

  function onPrevMonthClick() {
    setCurrentMonth(subMonths(currentMonth, 1));
    setIsNext(false);
  }

  function onNextMonthClick() {
    setCurrentMonth(addMonths(currentMonth, 1));
    setIsNext(true);
  }

  return (
    <div className="font-sans min-w-[330px] overflow-hidden p-4 box-content border-r">
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
            classNames={`${isNext ? "slide-next" : "slide-prev"}`}
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
