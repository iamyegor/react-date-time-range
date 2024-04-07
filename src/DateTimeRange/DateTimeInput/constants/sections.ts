import { SectionInfo } from "../types/SectionInfo.ts";

export const sections: SectionInfo[] = [
    { start: 0, end: 2, max: 12, name: "MM" },
    { start: 3, end: 5, max: 31, name: "dd" },
    { start: 6, end: 10, max: 9999, name: "yyyy" },
    { start: 11, end: 13, max: 12, name: "hh" },
    { start: 14, end: 16, max: 59, min: 0, name: "mm" },
    { start: 17, end: 19, max: 2, name: "aa" },
];
