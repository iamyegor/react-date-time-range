import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks.ts";
import {
    selectActiveInput,
    selectSecondDate,
    selectSecondSelectedTime,
    setActiveInput,
    setIsDateTimeShown,
    setSecondDate,
    setSecondSelectedTime,
} from "../../redux/dateTimeRangeSlice.ts";
import { ActiveInput } from "../../types.tsx";
import DateTimeContainer from "../DateTimeContainer.tsx";

export default function SecondDateTimeContainer({ text }: { text: string }) {
    const dispatch = useAppDispatch();

    const secondDate = useAppSelector(selectSecondDate);
    const secondSelectedTime = useAppSelector(selectSecondSelectedTime);
    const activeInput = useAppSelector(selectActiveInput);

    const [isSecondDateInvalid, setIsSecondDateInvalid] = useState(false);
    const [isSecondTimeInvalid, setIsSecondTimeInvalid] = useState(false);

    function handleInputFocus() {
        dispatch(setActiveInput(ActiveInput.Second));
        dispatch(setIsDateTimeShown(true));
    }

    function updateIsDateInvalid(isInvalid: boolean) {
        setIsSecondDateInvalid(isInvalid);
    }

    function updateIsTimeInvalid(isInvalid: boolean) {
        setIsSecondTimeInvalid(isInvalid);
    }

    return (
        <DateTimeContainer
            isActive={activeInput === ActiveInput.Second}
            text={text}
            date={secondDate}
            updateDate={(date) => dispatch(setSecondDate(date))}
            time={secondSelectedTime}
            updateTime={(time) => dispatch(setSecondSelectedTime(time))}
            onFocus={handleInputFocus}
            isDateInvalid={isSecondDateInvalid}
            updateIsDateInvalid={updateIsDateInvalid}
            isTimeInvalid={isSecondTimeInvalid}
            updateIsTimeInvalid={updateIsTimeInvalid}
            testId="second-date-time-container"
        />
    );
}
