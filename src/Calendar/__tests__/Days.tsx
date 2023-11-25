import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Days from "../Days"; // Update with the actual path to your component

describe("Days component", () => {
  it("renders seven days", () => {
    const currentMonth = new Date(2023, 5, 15); // June 15, 2023
    render(<Days currentMonth={currentMonth} />);

    const dayElements = screen.getAllByTestId("day-heading");
    expect(dayElements.length).toBe(7);
  });

  it("starts the week with the correct day", () => {
    const currentMonth = new Date(2023, 5, 15); // June 15, 2023
    render(<Days currentMonth={currentMonth} />);

    const dayElements = screen.getAllByTestId("day-heading");
    const firstDayElement = dayElements[0];
    expect(firstDayElement).toHaveTextContent(/su/i);
  });
});
