import { ReactElement } from "react";

interface FilledCellProps {
  dashedBorder: string;
  highlighted: string;
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
      <div
        className={`absolute top-[3px] left-[1px] bottom-[3px] right-[1px] 
        flex items-center justify-center ${dashedBorder}`}
      ></div>
      <div
        className={`w-8 h-8 flex items-center justify-center text-xs 
        group-hover:border group-hover:bg-blue-200/50 rounded-full 
        group-hover:border-gray-400 ${classes} z-10`}
      >
        <span>{formattedDate}</span>
      </div>
      <div
        className={`absolute top-[3px] left-0 bottom-[3px] right-0
        flex items-center justify-center ${highlighted}`}
      ></div>
    </div>
  );
}

export default FilledCell;
