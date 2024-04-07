import classNames from "classnames";
import { endOfMonth, isEqual, isSaturday, isSunday } from "date-fns";

const START = "rounded-l-full left-[0.3rem]";
const END = "rounded-r-full right-[0.3rem]";
const LEFT_EDGE = "rounded-l-full left-[0.3rem]";
const RIGHT_EDGE = "rounded-r-full right-[0.3rem]";

interface HighlightBaseProps {
    day: Date;
    stylingClasses: string;
    start: Date;
    end: Date;
    testid?: string;
}

export default function HighlightBase({
    testid = "highlight",
    day,
    stylingClasses,
    start,
    end,
}: HighlightBaseProps) {
    let leftSideChanged = false;
    let rightSideChanged = false;

    function shouldHighlight() {
        if (start && end) {
            if (day >= start && day <= end) {
                return true;
            }
        }

        return false;
    }

    function getHighlightedIfDayIsInRange() {
        let highlighted = stylingClasses;
        if (shouldHighlight()) {
            return classNames(highlighted, getStylingsForDifferentDates());
        }

        return "";
    }

    function getStylingsForDifferentDates() {
        let highlighted = "";
        highlighted = applyStylingForStartAndEnd(highlighted);
        highlighted = applyStylingForEdgeDates(highlighted);
        highlighted = applySideOffsetsIfUnchanged(highlighted);
        return highlighted;
    }

    function applyStylingForStartAndEnd(style: string) {
        if (start && isEqual(day, start)) {
            style = classNames(style, START);
            leftSideChanged = true;
        }
        if (end && isEqual(day, end)) {
            style = classNames(style, END);
            rightSideChanged = true;
        }
        return style;
    }

    function applyStylingForEdgeDates(style: string) {
        if (isSunday(day) || day.getDate() === 1) {
            style = classNames(style, LEFT_EDGE);
            leftSideChanged = true;
        }
        if (isSaturday(day) || day.getDate() === endOfMonth(day).getDate()) {
            style = classNames(style, RIGHT_EDGE);
            rightSideChanged = true;
        }
        return style;
    }

    function applySideOffsetsIfUnchanged(style: string) {
        if (!leftSideChanged) {
            style = classNames(style, "left-0");
        }
        if (!rightSideChanged) {
            style = classNames(style, "right-0");
        }
        return style;
    }

    return (
        <div
            className={`absolute top-[3px] bottom-[3px] flex items-center  
      justify-center ${getHighlightedIfDayIsInRange()}`}
            data-testid={`${shouldHighlight() ? testid : ""}`}
        ></div>
    );
}
