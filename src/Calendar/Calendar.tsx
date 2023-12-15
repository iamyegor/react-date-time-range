import { addMonths, isSameMonth, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectActiveInput,
  selectCurrentMonth,
  selectFirstDate,
  selectIsDragging,
  selectSecondDate,
  setCurrentMonth,
  setIsDragging,
} from "../features/dateTimeRangeSlice";
import { ActiveInput } from "../types";
import Cells from "./Cells";
import Days from "./Days";
import Header from "./Header";
import "./styles/Calendar.css";

const duration = 250;

function Calendar() {
  const dispatch = useAppDispatch();
  const currentMonth = useAppSelector(selectCurrentMonth);
  const isDragging = useAppSelector(selectIsDragging);
  const activeInput = useAppSelector(selectActiveInput);
  const firstDate = useAppSelector(selectFirstDate);
  const secondDate = useAppSelector(selectSecondDate);

  const [isNext, setIsNext] = useState(true);
  const [cellsComponents, setCellsComponents] = useState<
    { id: string; element: JSX.Element }[]
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

    dispatch(setCurrentMonth(newCurrentMonth));
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
    dispatch(setCurrentMonth(subMonths(currentMonth, 1)));
    setIsNext(false);
  }

  function onNextMonthClick() {
    dispatch(setCurrentMonth(addMonths(currentMonth, 1)));
    setIsNext(true);
  }

  return (
    <div
      className={`font-sans w-[360px] h-full p-4 border-r 
    overflow-hidden ${isDragging ? "cursor-grabbing" : ""}`}
      onMouseUp={() => dispatch(setIsDragging(false))}
      onMouseLeave={() => dispatch(setIsDragging(false))}
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
