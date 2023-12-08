import { ReactElement } from "react";
import { render } from "@testing-library/react";
import DateTimeRangeProvider from "../../Calendar/DateTimeRangeProvider";

export default function renderInProvider(element: ReactElement) {
  render(
    <DateTimeRangeProvider
      firstDate={null}
      onFirstDateChange={() => null}
      secondDate={null}
      onSecondDateChange={() => null}
    >
      {element}
    </DateTimeRangeProvider>
  );
}
