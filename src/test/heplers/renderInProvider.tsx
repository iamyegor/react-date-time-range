import { ReactElement } from "react";
import { render } from "@testing-library/react";
import CalendarProvider from "../../Calendar/CalendarProvider";

export default function renderInProvider(element: ReactElement) {
  render(
    <CalendarProvider firstDate={null} setFirstDate={() => null}>
      {element}
    </CalendarProvider>
  );
}
