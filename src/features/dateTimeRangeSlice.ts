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
  minTimeIn24Hours?: TimeIn24HourFormat;
  dateChangedWhileDragging: boolean;
  isDateTimeShown: boolean;
}

const initialState: DateTimeRangeState = {
  minTimeIn24Hours: undefined,
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
};

const slice = createSlice({
  name: "dateTimeRange",
  initialState,
  reducers: {
    setIsDateTimeShown: (
      state: DateTimeRangeState,
      action: PayloadAction<boolean>
    ) => {
      state.isDateTimeShown = action.payload;
    },
    setDraggedDate: (
      state: DateTimeRangeState,
      action: PayloadAction<DraggedDate>
    ) => {
      state.draggedDate = action.payload;
    },
    setFirstDate: {
      reducer: (
        state: DateTimeRangeState,
        action: PayloadAction<string | null>
      ) => {
        state.firstDate = action.payload;
      },
      prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
    },
    setSecondDate: {
      reducer: (
        state: DateTimeRangeState,
        action: PayloadAction<string | null>
      ) => {
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
      reducer: (
        state: DateTimeRangeState,
        action: PayloadAction<string | null>
      ) => {
        state.hoveredDate = action.payload;
      },
      prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
    },
    setShadowSelectedDate: {
      reducer: (
        state: DateTimeRangeState,
        action: PayloadAction<string | null>
      ) => {
        state.shadowSelectedDate = action.payload;
      },
      prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
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
    setEdgeSelectedDate: {
      reducer: (
        state: DateTimeRangeState,
        action: PayloadAction<string | null>
      ) => {
        state.edgeSelectedDate = action.payload;
      },
      prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
    },
    setDashedBorderDirection: (
      state: DateTimeRangeState,
      action: PayloadAction<DashedBorderDirection>
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
      reducer: (
        state: DateTimeRangeState,
        action: PayloadAction<string | null>
      ) => {
        state.minDate = action.payload;
      },
      prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
    },
    setMaxDate: {
      reducer: (
        state: DateTimeRangeState,
        action: PayloadAction<string | null>
      ) => {
        state.maxDate = action.payload;
      },
      prepare: (date: Date | null) => getPayloadAsStringOrNull(date),
    },
    setMinTimeIn24Hours: (
      state: DateTimeRangeState,
      action: PayloadAction<TimeIn24HourFormat | undefined>
    ) => {
      state.minTimeIn24Hours = action.payload;
    },
    setDateBasedOnActiveInput: (
      state: DateTimeRangeState,
      action: PayloadAction<string>
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
} = slice.actions;

const getDateTimeRangeState = (state: RootState) => state;
export const selectIsDateTimeShown = (state: RootState) =>
  getDateTimeRangeState(state).isDateTimeShown;
export const selectMinTimeIn24Hours = (state: RootState) =>
  getDateTimeRangeState(state).minTimeIn24Hours;
export const selectMaxDate = (state: RootState) => {
  const maxDate = getDateTimeRangeState(state).maxDate;
  return maxDate ? new Date(maxDate) : null;
};
export const selectMinDate = (state: RootState) => {
  const minDate = getDateTimeRangeState(state).minDate;
  return minDate ? new Date(minDate) : null;
};
export const selectDraggedDate = (state: RootState) =>
  getDateTimeRangeState(state).draggedDate;
export const selectFirstDate = (state: RootState) => {
  const firstDate = getDateTimeRangeState(state).firstDate;
  return firstDate ? new Date(firstDate) : null;
};
export const selectSecondDate = (state: RootState) => {
  const secondDate = getDateTimeRangeState(state).secondDate;
  return secondDate ? new Date(secondDate) : null;
};
export const selectCurrentMonth = (state: RootState) =>
  new Date(getDateTimeRangeState(state).currentMonth);
export const selectHoveredDate = (state: RootState) => {
  const hoveredDate = getDateTimeRangeState(state).hoveredDate;
  return hoveredDate ? new Date(hoveredDate) : null;
};
export const selectShadowSelectedDate = (state: RootState) => {
  const shadowSelectedDate = getDateTimeRangeState(state).shadowSelectedDate;
  return shadowSelectedDate ? new Date(shadowSelectedDate) : null;
};
export const selectIsDragging = (state: RootState) =>
  getDateTimeRangeState(state).isDragging;
export const selectActiveInput = (state: RootState) =>
  getDateTimeRangeState(state).activeInput;
export const selectFirstSelectedTime = (state: RootState) =>
  getDateTimeRangeState(state).firstSelectedTime;
export const selectSecondSelectedTime = (state: RootState) =>
  getDateTimeRangeState(state).secondSelectedTime;
export const selectFirstDateTimeIsGreater = (state: RootState) =>
  getDateTimeRangeState(state).firstDateTimeIsGreater;
export const selectEdgeSelectedDate = (state: RootState) => {
  const edgeSelectedDate = getDateTimeRangeState(state).edgeSelectedDate;
  return edgeSelectedDate ? new Date(edgeSelectedDate) : null;
};
export const selectDashedBorderDirection = (state: RootState) =>
  getDateTimeRangeState(state).dashedBorderDirection;
export const selectBannedDates = (state: RootState) => {
  const bannedDates = getDateTimeRangeState(state).bannedDates;
  return bannedDates.map((date) => new Date(date));
};
export const selectUseAMPM = (state: RootState) =>
  getDateTimeRangeState(state).useAMPM;
export const selectDateChangedWhileDragging = (state: RootState) =>
  getDateTimeRangeState(state).dateChangedWhileDragging;
