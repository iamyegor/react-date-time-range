import { useEffect, useRef, useState } from "react";
import "./styles/selection.css";
import classNames from "classnames";

interface SelectionProps {
    items: string[];
    selectedItem: string;
    onSelect: (item: string) => void;
    testid?: string;
    hasBorder?: boolean;
    disabledItems?: string[];
}

function Selection({
    disabledItems,
    items,
    selectedItem,
    onSelect,
    testid = "selection",
    hasBorder = false,
}: SelectionProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRef = useRef<HTMLButtonElement | null>(null);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [itemHeight, setItemHeight] = useState<number>(0);
    const [isItemFirstRender, setIsItemFirstRender] = useState<boolean>(true);
    const [currenScollIndex, setCurrentScrollIndex] = useState<number>(0);

    useEffect(() => {
        if (itemRef.current) {
            setItemHeight(itemRef.current.offsetHeight);
        }

        if (containerRef.current) {
            setContainerHeight(containerRef.current.clientHeight);
        }
    }, []);

    useEffect(() => {
        if (selectedItem && isItemFirstRender) {
            setIsItemFirstRender(false);
        }

        const itemIndex = items.indexOf(selectedItem) || 0;
        if (itemIndex !== currenScollIndex) {
            scrollToItem(itemIndex, !isItemFirstRender);
        }
    }, [selectedItem]);

    function getClassNames(item: string) {
        return classNames({
            "py-2 flex justify-center items-center rounded flex-shrink-0 w-10 h-9 text-sm transition-all":
                true,
            "selected-item": isSelected(item) && !isDisabled(item),
            "disabled-item": isDisabled(item),
            "disabled-selected-item": isDisabled(item) && isSelected(item),
            "cursor-pointer": !isDisabled(item),
        });
    }

    function isDisabled(item: string) {
        return disabledItems?.includes(item);
    }

    function isSelected(item: string) {
        return selectedItem === item;
    }

    function handleClick(item: string, index: number) {
        scrollToItem(index);
        onSelect(item);
    }

    function scrollToItem(index: number, isSmooth = true) {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: index * itemHeight,
                behavior: isSmooth ? "smooth" : "instant",
            });
            setCurrentScrollIndex(index);
        }
    }

    const bottomSpace = containerHeight - itemHeight;

    return (
        <div
            ref={containerRef}
            className={`flex flex-col selection-scroll w-12 overflow-hidden 
      hover:overflow-y-auto py-2 pl-1 ${hasBorder ? "border-r" : ""}`}
            style={{ paddingBottom: `${bottomSpace}px` }}
        >
            {items.map((item, index) => (
                <button
                    ref={index === 0 ? itemRef : null}
                    key={item}
                    className={getClassNames(item)}
                    onClick={() => handleClick(item, index)}
                    data-testid={`${testid}`}
                    disabled={disabledItems?.includes(item)}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}

export default Selection;
