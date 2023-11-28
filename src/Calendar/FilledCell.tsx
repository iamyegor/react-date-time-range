import { ReactElement } from "react";

interface FilledCellProps {
  dashedBorder: JSX.Element;
  highlighted: JSX.Element;
  classes: string;
  formattedDate: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function FilledCell({
  dashedBorder,
  highlighted,
  classes,
  formattedDate,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: FilledCellProps): ReactElement {
  return (
    <div
      data-testid="filled-cell"
      className="flex-1 py-1 flex justify-center items-center 
      hover:cursor-pointer group relative"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {dashedBorder}
      <div
        className={`w-8 h-8 flex items-center justify-center text-xs 
        group-hover:border group-hover:bg-blue-200/50 rounded-full 
        group-hover:border-gray-400 ${classes} z-10`}
      >
        <span>{formattedDate}</span>
      </div>
      {highlighted}
    </div>
  );
}

export default FilledCell;
