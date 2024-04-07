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
    ampm: "AM" | "PM" | "24";
}

export interface TimeIn24HourFormat extends Omit<Time, "ampm"> {
    ampm: "24";
}

export enum DashedBorderDirection {
    Left = "left",
    Right = "right",
}

