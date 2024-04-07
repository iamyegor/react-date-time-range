// import { SectionInfo } from "types";
// import { sections } from "globals";
// import { decrementValueIn, incrementValueIn } from "../functions/sectionIncrementer.ts";
// import { Section } from "../../enums/sections.ts";
//
// export default class SectionValueAdjusterWithArrows {
//     private readonly value: string;
//     private readonly isAmPm: boolean;
//     private readonly updateInputValue: (newValue: string) => void;
//
//     constructor(value: string, updateInputValue: (newValue: string) => void, isAmPm: boolean) {
//         this.value = value;
//         this.updateInputValue = updateInputValue;
//         this.isAmPm = isAmPm;
//     }
//
//     public adjust(currentSection: Section, pressedKey: string) {
//
//         if (!this.canAdjust(currentSection, pressedKey)) {
//             return;
//         }
//
//         if (start === 17 && end === 19) {
//             const isCurrentlyPM = this.value.slice(start, end) === "PM";
//             // updateSectionIn(this.value, );
//             // this.updateInputValue(isCurrentlyPM ? "AM" : "PM");
//
//             return;
//         }
//        
//         const newValue: number = "ArrowUp"
//             ? incrementValueIn(currentSection, this.value, this.isAmPm)
//             : decrementValueIn(currentSection, this.value, this.isAmPm);
//
//         const pads: number = end - start;
//         this.valueUpdater.update(currentSection!, currentValue.toString().padStart(pads, "0"));
//     }
//
//     public canAdjust(currentSection: SectionInfo | null, pressedKey: string): boolean {
//         if (!currentSection) {
//             return false;
//         }
//
//         return pressedKey === "ArrowUp" || pressedKey === "ArrowDown";
//     }
// }
