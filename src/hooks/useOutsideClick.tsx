import { useEffect, useState } from "react";

export default function useOutsideClick(element: HTMLElement | null) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  function handleClickOutside(event: MouseEvent) {
    const { target } = event;
    if ((element && !element.contains(target as Node)) || element === target) {
      setIsVisible(false);
    }
  }

  useEffect(() => {
    if (element) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      if (element) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [element]);

  return { isVisible, setIsVisible };
}
