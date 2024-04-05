import { createSelector, createSlice } from "@reduxjs/toolkit";
import {
    ActiveInput,
    DashedBorderDirection,
    DraggedDate,
    Time,
    TimeIn24HourFormat,
} from "../types";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { getDefaultSelectedTime } from "../utils";

interface DateTimeRangeState {
    draggedDate: DraggedDate;
    firstDate: string | null;
    secondDate: string | null;
    currentMonth: string;
    hoveredDate: string | null;
    shadowSelectedDate: string | null;
    isDragging: boolean;
    activeInput: ActiveInput;
    firstSelectedTime: Time | null;
    secondSelectedTime: Time | null;
    firstDateTimeIsGreater: boolean;
    edgeSelectedDate: string | null;
    dashedBorderDirection: DashedBorderDirection;
    bannedDates: string[];
    useAMPM: boolean;
    minDate: string | null;
    maxDate: string | null;
    dateChangedWhileDragging: boolean;
    isDateTimeShown: boolean;
    isFirstDateInvalid: boolean;
    isSecondDateInvalid: boolean;
    minTimeIn24Hours: TimeIn24HourFormat | null;
    maxTimeIn24Hours: TimeIn24HourFormat | null;
}

const initialState: DateTimeRangeState = {
    minTimeIn24Hours: null,
    maxTimeIn24Hours: null,
    maxDate: null,
    minDate: null,
    draggedDate: DraggedDate.First,
    firstDate: null,
    secondDate: null,
    currentMonth: new Date().toDateString(),
    hoveredDate: null,
    shadowSelectedDate: null,
    isDragging: false,
    activeInput: ActiveInput.None,
    firstSelectedTime: null,
    secondSelectedTime: null,
    firstDateTimeIsGreater: false,
    edgeSelectedDate: null,
    dashedBorderDirection: DashedBorderDirection.Left,
    bannedDates: [],
    useAMPM: false,
    dateChangedWhileDragging: false,
    isDateTimeShown: false,
    isFirstDateInvalid: false,
    isSecondDateInvalid: false,
};

const slice = createSlice({
    name: "dateTimeRange",
    initialState,
    reducers: {
        setMaxTimeIn24Hours: (
            state: DateTimeRangeState,
            action: PayloadAction<TimeIn24HourFormat | null>,
        ) => {
            state.maxTimeIn24Hours = action.payload;
        },
        setIsFirstDateInvalid: (state: DateTimeRangeState, action: PayloadAction<boolean>) => {
            state.isFirstDateInvalid = action.payload;
        },
        setIsDateTimeShown: (state: DateTimeRangeState, action: PayloadAction<boolean>) => {
            state.isDateTimeShown = action.payload;
        },
        setDraggedDate: (state: DateTimeRangeState, action: PayloadAction<DraggedDate>) => {
            state.draggedDate = action.payload;
        },
        setFirstDate: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string | null>) => {
                state.firstDate = action.payload;
            },
            prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
        },
        setSecondDate: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string | null>) => {
                state.secondDate = action.payload;
            },
            prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
        },
        setCurrentMonth: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string>) => {
                state.currentMonth = action.payload;
            },
            prepare: (date: Date) => ({
                payload: date?.toDateString(),
            }),
        },
        setHoveredDate: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string | null>) => {
                state.hoveredDate = action.payload;
            },
            prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
        },
        setShadowSelectedDate: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string | null>) => {
                state.shadowSelectedDate = action.payload;
            },
            prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
        },
        setIsDragging: (state: DateTimeRangeState, action: PayloadAction<boolean>) => {
            state.isDragging = action.payload;
        },
        setActiveInput: (state: DateTimeRangeState, action: PayloadAction<ActiveInput>) => {
            state.activeInput = action.payload;
        },
        setDateChangedWhileDragging: (
            state: DateTimeRangeState,
            action: PayloadAction<boolean>,
        ) => {
            state.dateChangedWhileDragging = action.payload;
        },
        setFirstSelectedTime: (state: DateTimeRangeState, action: PayloadAction<Time | null>) => {
            state.firstSelectedTime = action.payload;
        },
        setSecondSelectedTime: (state: DateTimeRangeState, action: PayloadAction<Time | null>) => {
            state.secondSelectedTime = action.payload;
        },
        setFirstDateTimeIsGreater: (state: DateTimeRangeState, action: PayloadAction<boolean>) => {
            state.firstDateTimeIsGreater = action.payload;
        },
        setEdgeSelectedDate: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string | null>) => {
                state.edgeSelectedDate = action.payload;
            },
            prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
        },
        setDashedBorderDirection: (
            state: DateTimeRangeState,
            action: PayloadAction<DashedBorderDirection>,
        ) => {
            state.dashedBorderDirection = action.payload;
        },
        setBannedDates: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string[]>) => {
                state.bannedDates = action.payload;
            },
            prepare: (dates: Date[]) => ({
                payload: dates.map((date) => date.toDateString()),
            }),
        },
        setUseAMPM: (state: DateTimeRangeState, action: PayloadAction<boolean>) => {
            state.useAMPM = action.payload;
        },
        setMinDate: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string | null>) => {
                state.minDate = action.payload;
            },
            prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
        },
        setMaxDate: {
            reducer: (state: DateTimeRangeState, action: PayloadAction<string | null>) => {
                state.maxDate = action.payload;
            },
            prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
        },
        setMinTimeIn24Hours: (
            state: DateTimeRangeState,
            action: PayloadAction<TimeIn24HourFormat | null>,
        ) => {
            state.minTimeIn24Hours = action.payload;
        },
        setDateBasedOnActiveInput: (state: DateTimeRangeState, action: PayloadAction<string>) => {
            if (state.activeInput === ActiveInput.First) {
                state.firstDate = action.payload;
            } else if (state.activeInput === ActiveInput.Second) {
                state.secondDate = action.payload;
            }
        },
        setDefaultTimeIfNotSet: (state: DateTimeRangeState) => {
            if (state.activeInput === ActiveInput.First && !state.firstSelectedTime) {
                state.firstSelectedTime = getDefaultSelectedTime(state.useAMPM);
            } else if (state.activeInput === ActiveInput.Second && !state.secondSelectedTime) {
                state.secondSelectedTime = getDefaultSelectedTime(state.useAMPM);
            }
        },
    },
});

function getPayloadAsStringOrNull(date: Date | null) {
    return { payload: date?.toDateString() || null };
}

export default slice.reducer;
export const {
    setDraggedDate,
    setFirstDate,
    setSecondDate,
    setCurrentMonth,
    setHoveredDate,
    setShadowSelectedDate,
    setIsDragging,
    setActiveInput,
    setDateChangedWhileDragging,
    setFirstSelectedTime,
    setSecondSelectedTime,
    setFirstDateTimeIsGreater,
    setEdgeSelectedDate,
    setDashedBorderDirection,
    setBannedDates,
    setUseAMPM,
    setMinDate,
    setMaxDate,
    setMinTimeIn24Hours,
    setDateBasedOnActiveInput,
    setDefaultTimeIfNotSet,
    setIsDateTimeShown,
    setMaxTimeIn24Hours,
} = slice.actions;

const getDateTimeRangeState = (state: RootState) => state;
export const selectMaxTimeIn24Hours = (state: RootState) =>
    getDateTimeRangeState(state).maxTimeIn24Hours;
export const selectIsDateTimeShown = (state: RootState) =>
    getDateTimeRangeState(state).isDateTimeShown;
export const selectMinTimeIn24Hours = (state: RootState) =>
    getDateTimeRangeState(state).minTimeIn24Hours;
export const selectDraggedDate = (state: RootState) => getDateTimeRangeState(state).draggedDate;
export const selectIsDragging = (state: RootState) => getDateTimeRangeState(state).isDragging;
export const selectActiveInput = (state: RootState) => getDateTimeRangeState(state).activeInput;
export const selectFirstSelectedTime = (state: RootState) =>
    getDateTimeRangeState(state).firstSelectedTime;
export const selectSecondSelectedTime = (state: RootState) =>
    getDateTimeRangeState(state).secondSelectedTime;
export const selectFirstDateTimeIsGreater = (state: RootState) =>
    getDateTimeRangeState(state).firstDateTimeIsGreater;
export const selectUseAMPM = (state: RootState) => getDateTimeRangeState(state).useAMPM;
export const selectDateChangedWhileDragging = (state: RootState) =>
    getDateTimeRangeState(state).dateChangedWhileDragging;
export const selectDashedBorderDirection = (state: RootState) =>
    getDateTimeRangeState(state).dashedBorderDirection;
export const selectCurrentMonth = createSelector(
    (state) => getDateTimeRangeState(state).currentMonth,
    (currentMonth) => new Date(currentMonth),
);
export const selectMaxDate = createSelector(
    (state) => getDateTimeRangeState(state).maxDate,
    (maxDate) => (maxDate ? new Date(maxDate) : null),
);
export const selectMinDate = createSelector(
    (state) => getDateTimeRangeState(state).minDate,
    (minDate) => (minDate ? new Date(minDate) : null),
);
export const selectFirstDate = createSelector(
    (state) => getDateTimeRangeState(state).firstDate,
    (firstDate) => (firstDate ? new Date(firstDate) : null),
);
export const selectSecondDate = createSelector(
    (state) => getDateTimeRangeState(state).secondDate,
    (secondDate) => (secondDate ? new Date(secondDate) : null),
);
export const selectHoveredDate = createSelector(
    (state) => getDateTimeRangeState(state).hoveredDate,
    (hoveredDate) => (hoveredDate ? new Date(hoveredDate) : null),
);
export const selectShadowSelectedDate = createSelector(
    (state) => getDateTimeRangeState(state).shadowSelectedDate,
    (shadowSelectedDate) => (shadowSelectedDate ? new Date(shadowSelectedDate) : null),
);
export const selectEdgeSelectedDate = createSelector(
    (state) => getDateTimeRangeState(state).edgeSelectedDate,
    (edgeSelectedDate) => (edgeSelectedDate ? new Date(edgeSelectedDate) : null),
);
export const selectBannedDates = createSelector(
    (state) => getDateTimeRangeState(state).bannedDates,
    (bannedDates: string[]) => bannedDates.map((date) => new Date(date)),
);
