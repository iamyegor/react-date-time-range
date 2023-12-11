import { Time } from "./types";

export function getDefaultSelectedTime(useAMPM: boolean): Time {
  return {
    hours: 12,
    minutes: 0,
    ampm: useAMPM ? "AM" : "24",
  };
}

export function isTimeEqual(time1: Time | null, time2: Time | null) {
  if (!time1 || !time2) {
    return false;
  }
  return (
    time1.hours === time2.hours &&
    time1.minutes === time2.minutes &&
    time1.ampm === time2.ampm
  );
}
