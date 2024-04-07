import { Time } from "../../../types.tsx";
import { isTimeValid } from "./timeValidator.ts";

export function parseTimeToString(time: Time, isAmPm: boolean): string {
    const suffix: string = isAmPm ? ` ${time.ampm}` : "";
    const hours: string = time.hours.toString().padStart(2, "0");
    const minutes: string = time.minutes.toString().padStart(2, "0");

    return `${hours}:${minutes}${suffix}`;
}

export function parseStringToTime(timeString: string): Time | null {
    const { hoursStr, minutesStr, ampm } = extractTimeParts(timeString);
    const parsedTime: { hours: number; minutes: number } | null = parseTime(hoursStr, minutesStr);

    if (!parsedTime || !isAmPmValid(ampm)) {
        return null;
    }

    return formatToTimeObj(parsedTime.hours, parsedTime.minutes, ampm);
}

function isAmPmValid(ampm: string): boolean {
    return ampm == "AM" || ampm == "PM" || ampm == "";
}

function extractTimeParts(timeString: string): {
    hoursStr: string;
    minutesStr: string;
    ampm: string;
} {
    const parts = timeString.split(" ");
    const timeParts = parts[0].split(":");

    return {
        hoursStr: timeParts[0],
        minutesStr: timeParts[1],
        ampm: parts[1] || "",
    };
}

function parseTime(
    hoursStr: string,
    minutesStr: string,
): { hours: number; minutes: number } | null {
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
        return null;
    }

    return { hours, minutes };
}

function formatToTimeObj(hours: number, minutes: number, ampm: string): Time | null {
    let time: Time;

    if (ampm === "AM" || ampm === "PM") {
        time = { hours, minutes, ampm };
    } else if (ampm === "") {
        let format = "24";
        if (hours < 12) {
            format = "AM";
        } else if (hours >= 12) {
            format = "PM";
            if (hours > 12) {
                hours -= 12;
            }
        }
        time = { hours, minutes, ampm: format as "AM" | "PM" | "24" };
    } else {
        throw new Error(`Invalid time suffix: ${ampm}`);
    }

    if (isTimeValid(time)) {
        return time;
    }

    return null;
}
