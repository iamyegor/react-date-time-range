import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import arrowBetweenDates from "../assets/icons/arrow-between-dates.svg";
import {
  selectActiveInput,
  selectFirstDate,
  selectFirstSelectedTime,
  selectSecondDate,
  selectSecondSelectedTime,
  setActiveInput,
  setBannedDates,
  setFirstDate,
  setFirstSelectedTime,
  setMaxDate,
  setMinDate,
  setMinTimeIn24Hours,
  setSecondDate,
  setSecondSelectedTime,
  setUseAMPM,
} from "../features/dateTimeRangeSlice";
import useIsDateLessThanMinDate from "../hooks/useIsDateLessThanMinDate";
import useIsTimeLessThanMinTime from "../hooks/useIsTimeLessThanMinTime";
import useOutsideClick from "../hooks/useOutsideClick";
import { ActiveInput } from "../types";
import { convertTo24HourFormat, formatToTime } from "../utils";
import DateTime from "./DateTime";
import DateTimeContainer from "./DateTimeContainer";
import "./styles/DateTimeRange.css";

interface DateTimeRangeProps {
  bannedDates?: Date[];
  useAMPM?: boolean;
  inputText: { start: string; end: string };
  minDate?: Date;
  maxDate?: Date;
  minTime?: Date;
}

export default function DateTimeRange({
  minTime,
  maxDate,
  minDate,
  bannedDates = [],
  useAMPM = false,
  inputText,
}: DateTimeRangeProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setMinDate(minDate?.toISOString()));
    dispatch(setMaxDate(maxDate));
    dispatch(setBannedDates(bannedDates));
    dispatch(setUseAMPM(useAMPM));
    if (minTime) {
      const minTimeIn24Hours = convertTo24HourFormat(
        formatToTime(minTime, useAMPM)
      );
      dispatch(setMinTimeIn24Hours(minTimeIn24Hours));
    }
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isVisible: showDateTime, setIsVisible: setShowDateTime } =
    useOutsideClick(containerRef.current);
  const [isFirstDateInvalid, setIsFirstDateInvalid] = useState<boolean>(false);
  const [isSecondDateInvalid, setIsSecondDateInvalid] =
    useState<boolean>(false);
  const { isFirstDateLessThanMinDate, isSecondDateLessThanMinDate } =
    useIsDateLessThanMinDate();
  const [isFirstTimeInvalid, setIsFirstTimeInvalid] = useState<boolean>(false);
  const [isSecondTimeInvalid, setIsSecondTimeInvalid] =
    useState<boolean>(false);
  const { isFirstTimeLessThanMinTime, isSecondTimeLessThanMinTime } =
    useIsTimeLessThanMinTime();

  useEffect(() => {
    if (!showDateTime) {
      dispatch(setActiveInput(ActiveInput.None));
    }
  }, [showDateTime]);

  function handleInputFocus(input: ActiveInput) {
    dispatch(setActiveInput(input));
    setShowDateTime(true);
  }

  const activeInput = useAppSelector(selectActiveInput);
  const firstDate = useAppSelector(selectFirstDate);
  const secondDate = useAppSelector(selectSecondDate);
  const firstSelectedTime = useAppSelector(selectFirstSelectedTime);
  const secondSelectedTime = useAppSelector(selectSecondSelectedTime);

  return (
    <>
      <div ref={containerRef} style={{ userSelect: "none" }}>
        <div className="flex items-center justify-center mb-2">
          <DateTimeContainer
            isActive={activeInput === ActiveInput.First}
            text={inputText.start}
            date={firstDate}
            updateDate={(date) => dispatch(setFirstDate(date))}
            time={firstSelectedTime}
            updateTime={(time) => dispatch(setFirstSelectedTime(time))}
            onFocus={() => handleInputFocus(ActiveInput.First)}
            isDateInvalid={isFirstDateInvalid}
            updateIsDateInvalid={(isInvalid) =>
              setIsFirstDateInvalid(isInvalid)
            }
            isTimeInvalid={isFirstTimeInvalid}
            updateIsTimeInvalid={(isInvalid) =>
              setIsFirstTimeInvalid(isInvalid)
            }
            isTimeLessThanMinTime={isFirstTimeLessThanMinTime}
            isDateLessThanMinDate={isFirstDateLessThanMinDate}
            testid="first-date-time-container"
          />
          <img src={arrowBetweenDates} alt="dash" className="mx-2 w-5 h-5" />
          <DateTimeContainer
            isActive={activeInput === ActiveInput.Second}
            text={inputText.end}
            date={secondDate}
            updateDate={(date) => dispatch(setSecondDate(date))}
            time={secondSelectedTime}
            updateTime={(time) => dispatch(setSecondSelectedTime(time))}
            onFocus={() => handleInputFocus(ActiveInput.Second)}
            isDateInvalid={isSecondDateInvalid}
            updateIsDateInvalid={(isInvalid) =>
              setIsSecondDateInvalid(isInvalid)
            }
            isTimeInvalid={isSecondTimeInvalid}
            updateIsTimeInvalid={(isInvalid) =>
              setIsSecondTimeInvalid(isInvalid)
            }
            isTimeLessThanMinTime={isSecondTimeLessThanMinTime}
            isDateLessThanMinDate={isSecondDateLessThanMinDate}
            testid="second-date-time-container"
          />
        </div>
        <CSSTransition
          in={showDateTime}
          timeout={200}
          classNames="date-time"
          unmountOnExit
        >
          <DateTime />
        </CSSTransition>
      </div>
    </>
    // <DateTimeRangeProvider
    //   firstDate={firstDate}
    //   secondDate={secondDate}
    //   activeInput={activeInput}
    //   onActiveInputChange={handleActiveInputChange}
    //   onFirstDateChange={handleFirstDateChange}
    //   onSecondDateChange={handleSecondDateChange}
    //   firstSelectedTime={firstSelectedTime}
    //   onFirstSelectedTimeChange={handleFirstTimeChange}
    //   secondSelectedTime={secondSelectedTime}
    //   onSecondSelectedTimeChange={handleSecondTimeChange}
    //   bannedDates={bannedDates}
    //   useAMPM={useAMPM}
    //   minDate={minDate}
    //   maxDate={maxDate}
    //   minTimeIn24Hours={
    //     minTime
    //       ? convertTo24HourFormat(formatToTime(minTime, useAMPM))
    //       : undefined
    //   }
    // >
    //   <div ref={containerRef} style={{ userSelect: "none" }}>
    //     <div className="flex items-center justify-center mb-2">
    //       <DateTimeContainer
    //         isActive={activeInput === ActiveInput.First}
    //         text={inputText.start}
    //         date={firstDate}
    //         onDateChange={handleFirstDateChange}
    //         time={firstSelectedTime}
    //         onTimeChange={handleFirstTimeChange}
    //         onFocus={() => handleInputFocus(ActiveInput.First)}
    //         testid="first-date-time-container"
    //         isTimeLessThanMinTime={isFirstTimeLessThanMinTime}
    //         isDateInvalid={isFirtsDateInvalid}
    //         onIsDateInvalidChange={handleIsFirstDateInvalidChange}
    //         isTimeInvalid={isFirstTimeInvalid}
    //         onIsTimeInvalidChange={handleIsFirstTimeInvalidChange}
    //         isDateLessThanMinDate={isFirstDateLessThanMinDate}
    //       />
    //       <img src={arrowBetweenDates} alt="dash" className="mx-2 w-5 h-5" />
    //       <DateTimeContainer
    //         isActive={activeInput === ActiveInput.Second}
    //         text={inputText.end}
    //         date={secondDate}
    //         onDateChange={setSecondDate}
    //         time={secondSelectedTime}
    //         onTimeChange={handleSecondTimeChange}
    //         onFocus={() => handleInputFocus(ActiveInput.Second)}
    //         testid="second-date-time-container"
    //         isTimeLessThanMinTime={isSecondTimeLessThanMinTime}
    //         isDateInvalid={isSecondDateInvalid}
    //         onIsDateInvalidChange={handleIsSecondDateInvalidChange}
    //         isTimeInvalid={isSecondTimeInvalid}
    //         onIsTimeInvalidChange={handleIsSecondTimeInvalidChange}
    //         isDateLessThanMinDate={isSecondDateLessThanMinDate}
    //       />
    //     </div>
    //     <CSSTransition
    //       in={showDateTime}
    //       timeout={200}
    //       classNames="date-time"
    //       unmountOnExit
    //     >
    //       <DateTime onOkButtonClick={() => handleOKButtonClick()} />
    //     </CSSTransition>
    //   </div>
    // </DateTimeRangeProvider>
  );
}
