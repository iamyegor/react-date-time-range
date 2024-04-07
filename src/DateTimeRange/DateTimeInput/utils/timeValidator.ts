import { Time } from "../../../types.tsx";

export function isTimeValid(time: Time) {
    const { hours, minutes, ampm } = time;
    if (ampm === "24") {
        return !(
            isNaN(hours) ||
            isNaN(minutes) ||
            hours > 23 ||
            hours < 1 ||
            minutes < 0 ||
            minutes > 59
        );
    } else {
        return !(
            isNaN(hours) ||
            isNaN(minutes) ||
            hours < 1 ||
            hours > 12 ||
            minutes < 0 ||
            minutes > 59 ||
            (ampm !== "AM" && ampm !== "PM")
        );
    }
}
