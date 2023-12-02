export enum DraggedDate {
  First = "first",
  Second = "second",
}

export enum ActiveInput {
  First = "first",
  Second = "second",
  None = "none",
}

export interface Time {
  hours: number;
  minutes: number;
  period: "AM" | "PM";
}
