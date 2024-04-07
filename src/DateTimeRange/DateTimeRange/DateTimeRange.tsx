import { useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useAppDispatch, useAppSelector } from "../../redux/hooks.ts";
import arrowBetweenDates from "../../assets/icons/arrow-between-dates.svg";
import {
    selectIsDateTimeShown,
    setBannedDates,
    setMaxDate,
    setMaxTimeIn24Hours,
    setMinDate,
    setMinTimeIn24Hours,
    setUseAMPM,
} from "../../redux/dateTimeRangeSlice.ts";
import useChangeInputBasedOnDragging from "./hooks/useChangeInputBasedOnDragging.tsx";
import useChanegDashedBorderDirection from "./hooks/useChanegDashedBorderDirection.tsx";
import useDeactivateInputs from "./hooks/useDeactivateInputs.tsx";
import useEdgeSelectedDate from "./hooks/useEdgeSelectedDate.tsx";
import useFirstDateTimeIsGreater from "./hooks/useFirstDateTimeIsGreater.tsx";
import useShowDateTime from "./hooks/useShowDateTime.tsx";
import { convertTo24HourFormat, formatToTime } from "../../utils.ts";
import DateTime from "../DateTime.tsx";
import FirstDateTimeContainer from "../containers/FirstDateTimeContainer.tsx";
import SecondDateTimeContainer from "../containers/SecondDateTimeContainer.tsx";
import "../styles/dateTimeRange.css";

interface DateTimeRangeProps {
    bannedDates?: Date[];
    useAMPM?: boolean;
    inputText: { start: string; end: string };
    minDate?: Date | null;
    maxDate?: Date | null;
    minTime?: Date | null;
    maxTime?: Date | null;
}

export default function DateTimeRange({
    maxTime = null,
    minTime = null,
    maxDate = null,
    minDate = null,
    bannedDates = [],
    useAMPM = false,
    inputText,
}: DateTimeRangeProps) {
    const dispatch = useAppDispatch();
    const containerRef = useRef<HTMLDivElement | null>(null);

    useChangeInputBasedOnDragging();
    useDeactivateInputs();
    useShowDateTime(containerRef.current);
    useFirstDateTimeIsGreater();
    useChanegDashedBorderDirection();
    useEdgeSelectedDate();
    useEffect(() => {
        dispatch(setMinDate(minDate));
        dispatch(setMaxDate(maxDate));
        dispatch(setBannedDates(bannedDates));
        dispatch(setUseAMPM(useAMPM));

        if (minTime) {
            const minTimeAsTime = formatToTime(minTime, useAMPM);
            const minTimeIn24Hours = convertTo24HourFormat(minTimeAsTime);
            dispatch(setMinTimeIn24Hours(minTimeIn24Hours));
        }

        if (maxTime) {
            const maxTimeAsTime = formatToTime(maxTime, useAMPM);
            const maxTimeIn24Hours = convertTo24HourFormat(maxTimeAsTime);
            dispatch(setMaxTimeIn24Hours(maxTimeIn24Hours));
        }
    }, []);

    const isDateTimeShown = useAppSelector(selectIsDateTimeShown);

    return (
        <>
            <div ref={containerRef} style={{ userSelect: "none" }}>
                <div className="flex items-center justify-center mb-2">
                    <FirstDateTimeContainer text={inputText.start} />
                    <img src={arrowBetweenDates} alt="dash" className="mx-2 w-5 h-5" />
                    <SecondDateTimeContainer text={inputText.end} />
                </div>
                <CSSTransition
                    in={isDateTimeShown}
                    timeout={200}
                    classNames="date-time"
                    unmountOnExit
                >
                    <DateTime />
                </CSSTransition>
            </div>
        </>
    );
}
