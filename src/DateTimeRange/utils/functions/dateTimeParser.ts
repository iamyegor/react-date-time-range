import { Time } from "../../../types.tsx";

export function parseTimeToString(time: Time, isAmPm: boolean): string {
    const suffix: string = isAmPm ? ` ${time.ampm}` : "";
    const hours: string = time.hours.toString().padStart(2, "0");
    const minutes: string = time.minutes.toString().padStart(2, "0");

    return `${hours}:${minutes}${suffix}`;
}

export function parseDateToString(date: Date): string {
    const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
    const day: string = date.getDate().toString().padStart(2, "0");
    const year: string = date.getFullYear().toString().padStart(4, "0");

    return `${month}/${day}/${year}`;
}
