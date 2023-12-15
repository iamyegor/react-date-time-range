import { configureStore } from "@reduxjs/toolkit";
import dateTimeRangeReducer from "../features/dateTimeRangeSlice";

const store = configureStore({
  reducer: dateTimeRangeReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
