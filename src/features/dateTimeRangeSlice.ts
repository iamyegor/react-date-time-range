import { createSlice } from "@reduxjs/toolkit";
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
  firstDate: Date | null;
  secondDate: Date | null;
  currentMonth: Date;
  hoveredDate: Date | null;
  shadowSelectedDate: Date | null;
  isDragging: boolean;
  activeInput: ActiveInput;
  firstSelectedTime: Time | null;
  secondSelectedTime: Time | null;
  firstDateTimeIsGreater: boolean;
  edgeSelectedDate: Date | null;
  dashedBorderDirection: DashedBorderDirection;
  bannedDates: Date[];
  useAMPM: boolean;
  minDate?: Date;
  maxDate?: Date;
  minTimeIn24Hours?: TimeIn24HourFormat;
  dateChangedWhileDragging: boolean;
  showDateTime: boolean;
}

const initialState: DateTimeRangeState = {
  minTimeIn24Hours: undefined,
  maxDate: undefined,
  minDate: undefined,
  draggedDate: DraggedDate.First,
  firstDate: null,
  secondDate: null,
  currentMonth: new Date(),
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
  showDateTime: false,
};

const slice = createSlice({
  name: "dateTimeRange",
  initialState,
  reducers: {
    setShowDateTime: (
      state: DateTimeRangeState,
      action: PayloadAction<boolean>
    ) => {
      state.showDateTime = action.payload;
    },
    setDraggedDate: (
      state: DateTimeRangeState,
      action: PayloadAction<DraggedDate>
    ) => {
      state.draggedDate = action.payload;
    },
    setFirstDate: (
      state: DateTimeRangeState,
      action: PayloadAction<Date | null>
    ) => {
      state.firstDate = action.payload;
    },
    setSecondDate: (
      state: DateTimeRangeState,
      action: PayloadAction<Date | null>
    ) => {
      state.secondDate = action.payload;
    },
    setCurrentMonth: (
      state: DateTimeRangeState,
      action: PayloadAction<Date>
    ) => {
      state.currentMonth = action.payload;
    },
    setHoveredDate: (
      state: DateTimeRangeState,
      action: PayloadAction<Date | null>
    ) => {
      state.hoveredDate = action.payload;
    },
    setShadowSelectedDate: (
      state: DateTimeRangeState,
      action: PayloadAction<Date | null>
    ) => {
      state.shadowSelectedDate = action.payload;
    },
    setIsDragging: (
      state: DateTimeRangeState,
      action: PayloadAction<boolean>
    ) => {
      state.isDragging = action.payload;
    },
    setActiveInput: (
      state: DateTimeRangeState,
      action: PayloadAction<ActiveInput>
    ) => {
      state.activeInput = action.payload;
    },
    setDateChangedWhileDragging: (
      state: DateTimeRangeState,
      action: PayloadAction<boolean>
    ) => {
      state.dateChangedWhileDragging = action.payload;
    },
    setFirstSelectedTime: (
      state: DateTimeRangeState,
      action: PayloadAction<Time | null>
    ) => {
      state.firstSelectedTime = action.payload;
    },
    setSecondSelectedTime: (
      state: DateTimeRangeState,
      action: PayloadAction<Time | null>
    ) => {
      state.secondSelectedTime = action.payload;
    },
    setFirstDateTimeIsGreater: (
      state: DateTimeRangeState,
      action: PayloadAction<boolean>
    ) => {
      state.firstDateTimeIsGreater = action.payload;
    },
    setEdgeSelectedDate: (
      state: DateTimeRangeState,
      action: PayloadAction<Date | null>
    ) => {
      state.edgeSelectedDate = action.payload;
    },
    setDashedBorderDirection: (
      state: DateTimeRangeState,
      action: PayloadAction<DashedBorderDirection>
    ) => {
      state.dashedBorderDirection = action.payload;
    },
    setBannedDates: (
      state: DateTimeRangeState,
      action: PayloadAction<Date[]>
    ) => {
      state.bannedDates = action.payload;
    },
    setUseAMPM: (state: DateTimeRangeState, action: PayloadAction<boolean>) => {
      state.useAMPM = action.payload;
    },
    setMinDate: (
      state: DateTimeRangeState,
      action: PayloadAction<Date | undefined>
    ) => {
      state.minDate = action.payload;
    },
    setMaxDate: (
      state: DateTimeRangeState,
      action: PayloadAction<Date | undefined>
    ) => {
      state.maxDate = action.payload;
    },
    setMinTimeIn24Hours: (
      state: DateTimeRangeState,
      action: PayloadAction<TimeIn24HourFormat | undefined>
    ) => {
      state.minTimeIn24Hours = action.payload;
    },
    setDateBasedOnActiveInput: (
      state: DateTimeRangeState,
      action: PayloadAction<Date>
    ) => {
      if (state.activeInput === ActiveInput.First) {
        state.firstDate = action.payload;
      } else if (state.activeInput === ActiveInput.Second) {
        state.secondDate = action.payload;
      }
    },
    setDefaultTimeIfNotSet: (state: DateTimeRangeState) => {
      if (state.activeInput === ActiveInput.First && !state.firstSelectedTime) {
        state.firstSelectedTime = getDefaultSelectedTime(state.useAMPM);
      } else if (
        state.activeInput === ActiveInput.Second &&
        !state.secondSelectedTime
      ) {
        state.secondSelectedTime = getDefaultSelectedTime(state.useAMPM);
      }
    },
  },
});

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
  setShowDateTime,
} = slice.actions;

const selectDateTimeRangeState = (state: RootState) => state;
export const selectShowDateTime = (state: RootState) =>
  selectDateTimeRangeState(state).showDateTime;
export const selectMinTimeIn24Hours = (state: RootState) =>
  selectDateTimeRangeState(state).minTimeIn24Hours;
export const selectMaxDate = (state: RootState) =>
  selectDateTimeRangeState(state).maxDate;
export const selectMinDate = (state: RootState) =>
  selectDateTimeRangeState(state).minDate;
export const selectDraggedDate = (state: RootState) =>
  selectDateTimeRangeState(state).draggedDate;
export const selectFirstDate = (state: RootState) =>
  selectDateTimeRangeState(state).firstDate;
export const selectSecondDate = (state: RootState) =>
  selectDateTimeRangeState(state).secondDate;
export const selectCurrentMonth = (state: RootState) =>
  selectDateTimeRangeState(state).currentMonth;
export const selectHoveredDate = (state: RootState) =>
  selectDateTimeRangeState(state).hoveredDate;
export const selectShadowSelectedDate = (state: RootState) =>
  selectDateTimeRangeState(state).shadowSelectedDate;
export const selectIsDragging = (state: RootState) =>
  selectDateTimeRangeState(state).isDragging;
export const selectActiveInput = (state: RootState) =>
  selectDateTimeRangeState(state).activeInput;
export const selectFirstSelectedTime = (state: RootState) =>
  selectDateTimeRangeState(state).firstSelectedTime;
export const selectSecondSelectedTime = (state: RootState) =>
  selectDateTimeRangeState(state).secondSelectedTime;
export const selectFirstDateTimeIsGreater = (state: RootState) =>
  selectDateTimeRangeState(state).firstDateTimeIsGreater;
export const selectEdgeSelectedDate = (state: RootState) =>
  selectDateTimeRangeState(state).edgeSelectedDate;
export const selectDashedBorderDirection = (state: RootState) =>
  selectDateTimeRangeState(state).dashedBorderDirection;
export const selectBannedDates = (state: RootState) =>
  selectDateTimeRangeState(state).bannedDates;
export const selectUseAMPM = (state: RootState) =>
  selectDateTimeRangeState(state).useAMPM;
export const selectDateChangedWhileDragging = (state: RootState) =>
  selectDateTimeRangeState(state).dateChangedWhileDragging;
