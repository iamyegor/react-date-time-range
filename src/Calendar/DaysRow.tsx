import { addDays, format, startOfWeek } from "date-fns";

interface DaysRowProps {
  currentMonth: Date;
}

function DaysRow({ currentMonth }: DaysRowProps) {
  const dateFormat = "iiiiii";
  const days = [];
  let startDate = startOfWeek(currentMonth);

  for (let i = 0; i < 7; i++) {
    days.push(
      <div className="column col-center" key={i}>
        {format(addDays(startDate, i), dateFormat)}
      </div>
    );
  }

  return <div className="days row">{days}</div>;
}

export default DaysRow;
