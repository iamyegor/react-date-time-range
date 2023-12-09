import { Section } from "./types";

export const sections: Section[] = [
  { start: 0, end: 2, max: 12, name: "MM" },
  { start: 3, end: 5, max: 31, name: "dd" },
  { start: 6, end: 10, max: 9999, name: "yyyy" },
  { start: 11, end: 13, max: 12, name: "hh" },
  { start: 14, end: 16, max: 59, min: 0, name: "mm" },
  { start: 17, end: 19, max: 2, name: "aa" },
];

export const TIME_PLACEHOLDER = `${sections[3].name}:${sections[4].name} ${sections[5].name}`;
export const DATE_PLACEHOLDER = `${sections[0].name}/${sections[1].name}/${sections[2].name}`;
export const DATE_TIME_PLACEHOLDER = `${DATE_PLACEHOLDER} ${TIME_PLACEHOLDER}`;
