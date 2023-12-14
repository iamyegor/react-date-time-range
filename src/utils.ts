import { Time, TimeIn24HourFormat } from "./types";

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

export function convertTo24HourFormat(time: Time): TimeIn24HourFormat {
  const hours = time.ampm == "PM" ? time.hours + 12 : time.hours;

  return {
    hours,
    minutes: time.minutes,
    ampm: "24",
  };
}

export function convertToAMPMFormat(time: TimeIn24HourFormat): Time {
  const hours = time.hours > 12 ? time.hours - 12 : time.hours;

  return {
    hours,
    minutes: time.minutes,
    ampm: time.hours > 12 ? "PM" : "AM",
  };
}

export function isTimeLesser(time1: Time | null, time2: Time | null): boolean {
  if (!time1 || !time2) {
    return false;
  }

  const time1Format24 = convertTo24HourFormat(time1);
  const time2Format24 = convertTo24HourFormat(time2);
  if (time1Format24.hours !== time2Format24.hours) {
    return time1Format24.hours < time2Format24.hours;
  }

  if (time1Format24.minutes !== time2Format24.minutes) {
    return time1Format24.minutes < time2Format24.minutes;
  }
  return false;
}

export default function convertTo2DigitString(num: number) {
  return num.toString().padStart(2, "0");
}

export function formatToTime(date: Date, isAMPM: boolean): Time {
  if (isAMPM) {
    return {
      hours: date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
      minutes: date.getMinutes(),
      ampm: date.getHours() < 12 ? "AM" : "PM",
    };
  } else {
    return {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      ampm: "24",
    };
  }
}
