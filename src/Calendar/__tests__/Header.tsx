import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";
import Header from "../Header";

describe("Header Component", () => {
  const mockPrevMonthClick = vi.fn();
  const mockNextMonthClick = vi.fn();
  const currentMonth = new Date(2023, 3, 1);

  beforeEach(() => {
    render(
      <Header
        currentMonth={currentMonth}
        onPrevMonthClick={mockPrevMonthClick}
        onNextMonthClick={mockNextMonthClick}
      />
    );
  });

  it("renders current month and year", () => {
    expect(
      screen.getByText(format(currentMonth, "MMMM yyyy"))
    ).toBeInTheDocument();
  });

  it("calls onPrevMonthClick when the previous button is clicked", async () => {
    await userEvent.click(screen.getByText("<"));
    expect(mockPrevMonthClick).toHaveBeenCalled();
  });

  it("calls onNextMonthClick when the next button is clicked", async () => {
    await userEvent.click(screen.getByText(">"));
    expect(mockNextMonthClick).toHaveBeenCalled();
  });
});
