import { useEffect, useRef, useState } from "react";
import "./styles/Selection.css";

interface SelectionProps {
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
  testid?: string;
  hasBorder?: boolean;
}

function Selection({
  items,
  selectedItem,
  onSelect,
  testid = "selection",
  hasBorder = false,
}: SelectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [itemHeight, setItemHeight] = useState<number>(0);

  useEffect(() => {
    if (itemRef.current) {
      setItemHeight(itemRef.current.offsetHeight);
    }
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    if (!selectedItem) {
      scrollToItem(0);
    } else {
      const index = items.indexOf(selectedItem);
      scrollToItem(index);
    }
  }, [selectedItem]);

  function getClassNames(item: string) {
    return `cursor-pointer py-2 flex justify-center items-center rounded 
    flex-shrink-0 w-10 h-9 text-sm transition-all  ${
      selectedItem === item ? "bg-blue-500 text-white" : ""
    }`;
  }

  function handleClick(item: string, index: number) {
    scrollToItem(index);
    onSelect(item);
  }

  function scrollToItem(index: number) {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      });
    }
  }

  const bottomSpace = containerHeight - itemHeight;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col selection-scroll w-12 overflow-hidden 
      hover:overflow-y-auto py-2 pl-1 ${hasBorder ? "border-r" : ""}`}
      style={{ paddingBottom: `${bottomSpace}px` }}
      data-testid={`${testid}`}
    >
      {items.map((item, index) => (
        <div
          ref={index === 0 ? itemRef : null}
          key={item}
          className={getClassNames(item)}
          onClick={() => handleClick(item, index)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default Selection;
