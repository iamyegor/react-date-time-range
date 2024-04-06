import { resolveSectionInfo } from "./sectionResolver.ts";
import { SectionInfo } from "../../../types.tsx";
import { Section } from "../../enums/sections.ts";

export function toggleAmPm(value: string): string {
    const sectionInfo: SectionInfo = resolveSectionInfo(Section.AmPm);
    const amPm: string = value.slice(sectionInfo.start, sectionInfo.end);

    if (amPm == "AM") {
        return "PM";
    } else {
        return "AM";
    }
}
