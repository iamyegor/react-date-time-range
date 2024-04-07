import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks.ts";
import { hours12, hours24, minutes } from "../../constants.ts";
import {
    selectActiveInput,
    selectFirstDate,
    selectFirstSelectedTime,
    selectMinTimeIn24Hours,
    selectSecondDate,
    selectSecondSelectedTime,
    selectUseAMPM,
    setFirstDate,
    setFirstSelectedTime,
    setSecondDate,
    setSecondSelectedTime,
} from "../../redux/dateTimeRangeSlice.ts";
import useDisabledHours from "./hooks/useDisabledHours.tsx";
import useDisabledMinutes from "./hooks/useDisabledMinutes.tsx";
import { ActiveInput, Time } from "../../types.tsx";
import convertTo2DigitString, { getDefaultSelectedTime, isTimeEqual } from "../../utils.ts";
import Selection from "../Selection.tsx";

const periods = ["AM", "PM"];

function TimePicker() {
    const dispatch = useAppDispatch();
    const firstDate = useAppSelector(selectFirstDate);
    const secondDate = useAppSelector(selectSecondDate);
    const activeInput = useAppSelector(selectActiveInput);
    const firstSelectedTime = useAppSelector(selectFirstSelectedTime);
    const secondSelectedTime = useAppSelector(selectSecondSelectedTime);
    const useAMPM = useAppSelector(selectUseAMPM);

    const [selectedTime, setSelectedTime] = useState<Time | null>(null);
    const disabledHours = useDisabledHours(selectedTime, useAMPM);
    const disabledMinutes = useDisabledMinutes(selectedTime);

    useEffect(() => {
        if (activeInput === ActiveInput.First) {
            setSelectedTime(firstSelectedTime);
        } else if (activeInput === ActiveInput.Second) {
            setSelectedTime(secondSelectedTime);
        }
    }, [activeInput, firstSelectedTime, secondSelectedTime]);

    useEffect(() => {
        if (!selectedTime) {
            return;
        }

        if (activeInput === ActiveInput.First && !isTimeEqual(selectedTime, firstSelectedTime)) {
            dispatch(setFirstSelectedTime(selectedTime));
            setFirstDateIfNotSet();
        } else if (
            activeInput === ActiveInput.Second &&
            !isTimeEqual(selectedTime, secondSelectedTime)
        ) {
            dispatch(setSecondSelectedTime(selectedTime));
            setSecondDateIfNotSet();
        }
    }, [selectedTime]);

    function handleTimeChange(key: string, value: number | string) {
        updateSelectedTime(key, value);
    }

    function setFirstDateIfNotSet() {
        if (!firstDate) {
            dispatch(setFirstDate(startOfDay(new Date())));
        }
    }

    function setSecondDateIfNotSet() {
        if (!secondDate) {
            dispatch(setSecondDate(startOfDay(new Date())));
        }
    }

    function updateSelectedTime(key: string, value: number | string) {
        setSelectedTime((prev) => {
            if (prev) {
                return { ...prev, [key]: value } as Time;
            } else {
                return { ...getDefaultSelectedTime(useAMPM), [key]: value } as Time;
            }
        });
    }

    return (
        <div className="flex flex-col">
            <div className="flex overflow-hidden">
                <Selection
                    disabledItems={disabledHours}
                    items={useAMPM ? hours12 : hours24}
                    selectedItem={selectedTime ? convertTo2DigitString(selectedTime.hours) : ""}
                    onSelect={(item) => handleTimeChange("hours", parseInt(item))}
                    hasBorder
                    testid="hour-option"
                />
                <Selection
                    disabledItems={disabledMinutes}
                    items={minutes}
                    selectedItem={selectedTime ? convertTo2DigitString(selectedTime.minutes) : ""}
                    onSelect={(item) => handleTimeChange("minutes", parseInt(item))}
                    hasBorder
                    testid="minute-option"
                />
                {useAMPM && (
                    <Selection
                        items={periods}
                        selectedItem={selectedTime ? selectedTime.ampm : ""}
                        onSelect={(ampm) => handleTimeChange("ampm", ampm)}
                        testid="period-option"
                    />
                )}
            </div>
        </div>
    );
}

export default TimePicker;
