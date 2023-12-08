import { addMonths, isSameMonth, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { ActiveInput } from "../types";
import Cells from "./Cells";
import { useDateTimeRange } from "./DateTimeRangeProvider";
import Days from "./Days";
import Header from "./Header";
import "./styles/Calendar.css";

const duration = 250;

function Calendar() {
  const {
    currentMonth,
    onCurrentMonthChange,
    isDragging,
    onIsDraggingChange,
    activeInput,
    firstDate,
    secondDate,
  } = useDateTimeRange();
  const [isNext, setIsNext] = useState(true);
  const [cellsComponents, setCellsComponents] = useState<
    { id: string; element: JSX.Element; isNext: boolean }[]
  >([]);
  const [isCellsFirstRender, setIsCellsFirstRender] = useState(true);

  useEffect(() => {
    let newCurrentMonth = currentMonth;
    if (activeInput === ActiveInput.First && firstDate) {
      newCurrentMonth = firstDate;
    } else if (activeInput === ActiveInput.Second && secondDate) {
      newCurrentMonth = secondDate;
    }

    setIsNext(newCurrentMonth > currentMonth);
    onCurrentMonthChange(newCurrentMonth);
  }, [activeInput]);

  useEffect(() => {
    if (isCellsFirstRender && cellsComponents.length === 1) {
      setIsCellsFirstRender(false);
    }
  }, [cellsComponents]);

  useEffect(() => {
    if (shouldUpdateCells()) {
      const key =
        currentMonth.getMonth().toString() +
        currentMonth.getFullYear().toString();

      const newComponent = {
        id: key,
        element: <Cells currentMonth={currentMonth} key={key} />,
        isNext: isNext,
      };

      setCellsComponents([newComponent]);
    }
  }, [currentMonth]);

  function shouldUpdateCells() {
    if (isCellsFirstRender) {
      if (activeInput === ActiveInput.First && firstDate) {
        return isSameMonth(firstDate, currentMonth);
      } else if (activeInput === ActiveInput.Second && secondDate) {
        return isSameMonth(secondDate, currentMonth);
      }
    }
    return true;
  }

  function onPrevMonthClick() {
    onCurrentMonthChange(subMonths(currentMonth, 1));
    setIsNext(false);
  }

  function onNextMonthClick() {
    onCurrentMonthChange(addMonths(currentMonth, 1));
    setIsNext(true);
  }

  return (
    <div
      className={`font-sans w-[360px] h-full p-4 border-r 
    overflow-hidden ${isDragging ? "cursor-grabbing" : ""}`}
      onMouseUp={() => onIsDraggingChange(false)}
      onMouseLeave={() => onIsDraggingChange(false)}
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
              !isCellsFirstRender
                ? `${isNext ? "slide-next" : "slide-prev"}`
                : ""
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
