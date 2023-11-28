import "./styles/Selection.css";

interface SelectionProps {
  items: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
  testid?: string;
}

function Selection({
  items,
  selectedItem,
  setSelectedItem,
  testid = "selection",
}: SelectionProps) {
  function getClassNames(item: string) {
    return `cursor-pointer py-2 flex justify-center items-center rounded-full 
    flex-shrink-0 w-10 h-10 text-sm ${
      selectedItem === item ? "bg-blue-500 text-white" : ""
    }`;
  }

  return (
    <div
      className="flex flex-col selection-scroll overflow-auto"
      data-testid={`${testid}`}
    >
      {items.map((item) => (
        <div
          key={item}
          className={getClassNames(item)}
          onClick={() => setSelectedItem(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default Selection;
