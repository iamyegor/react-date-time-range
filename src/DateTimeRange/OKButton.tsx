import { ReactNode, useEffect, useRef, useState } from "react";

interface OKButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export default function OKButton({ children, onClick }: OKButtonProps) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setIsClicked(false);
      }, 200);

      return () => clearTimeout(timer.current!);
    }
  }, [isClicked]);

  function handleButtonClick() {
    setIsClicked(true);
    onClick();
  }

  return (
    <button
      className="flex flex-1 items-center justify-end pr-5 py-2"
      onClick={() => handleButtonClick()}
    >
      <p
        className={`p-0.5 px-3 flex justify-center items-center transition-all
          duration-200 bg-blue-500 text-white rounded  
          ${isClicked ? "active-shadow" : "shadow shadow-blue-500/50"}`}
      >
        {children}
      </p>
    </button>
  );
}
