import { Time } from "./types";

export function getDefaultSelectedTime(): Time {
  return {
    hours: 12,
    minutes: 0,
    ampm: "AM",
  };
}
