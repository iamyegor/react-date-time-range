import { ReactElement } from "react";

interface FilledCellProps {
  dottedBorder: string;
  classes: string;
  formattedDate: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function FilledCell({
  dottedBorder,
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
      hover:cursor-pointer group relative rounded-l-"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`absolute top-[3px] left-[1px] bottom-[3px] right-[1px] 
        flex items-center justify-center ${dottedBorder}`}
      ></div>
      <div
        className={`w-8 h-8 flex items-center justify-center text-xs 
        group-hover:border group-hover:bg-blue-200/50 rounded-full 
        group-hover:border-gray-400 ${classes}`}
      >
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}

export default FilledCell;