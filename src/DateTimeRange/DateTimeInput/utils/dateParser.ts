export function parseDateToString(date: Date): string {
    const month: string = (date.getMonth() + 1).toString().padStart(2, "0");
    const day: string = date.getDate().toString().padStart(2, "0");
    const year: string = date.getFullYear().toString().padStart(4, "0");

    return `${month}/${day}/${year}`;
}

export function parseStringToDate(dateString: string): Date | null {
    const parts = dateString.split("/");

    if (parts.length !== 3) {
        throw new Error("Incorrect date format");
    }

    const month = parseInt(parts[0], 10) - 1; 
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(month) || isNaN(day) || isNaN(year)) {
        return null;
    }

    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        return null;
    }

    return date;
}
