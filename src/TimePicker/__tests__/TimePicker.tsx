import { render, screen, within } from "@testing-library/react";
import TimePicker from "../TimePicker";

describe("TimePicker Component", () => {
  beforeEach(() => {
    render(<TimePicker />);
  });

  it("renders hours", () => {
    const hours = Array.from({ length: 12 }, (_, i) =>
      String(i + 1).padStart(2, "0")
    );

    const withinHoursElement = within(screen.getByTestId("hours"));
    hours.forEach((hour) => {
      expect(withinHoursElement.getByText(hour)).toBeInTheDocument();
    });
  });

  it("renders minutes", () => {
    const minutes = Array.from({ length: 12 }, (_, i) =>
      String(i * 5).padStart(2, "0")
    );

    const withinMinutesElement = within(screen.getByTestId("minutes"));
    minutes.forEach((minute) => {
      expect(withinMinutesElement.getByText(minute)).toBeInTheDocument();
    });
  });

  it("renders periods", () => {
    const periods = ["AM", "PM"];

    const withinPeriodsElement = within(screen.getByTestId("periods"));
    periods.forEach((period) => {
      expect(withinPeriodsElement.getByText(period)).toBeInTheDocument();
    });
  });
});
