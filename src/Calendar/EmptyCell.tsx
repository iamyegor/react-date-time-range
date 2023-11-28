import { ReactElement } from "react";

function EmptyCell(): ReactElement {
  return (
    <div data-testid="empty-cell" className="flex-1 py-1">
      <div className="w-8 h-8" />
    </div>
  );
}

export default EmptyCell;