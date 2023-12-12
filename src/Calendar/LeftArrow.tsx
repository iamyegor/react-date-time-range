interface LeftArrowProps {
  isDisabled: boolean;
}

export default function LeftArrow({ isDisabled }: LeftArrowProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={isDisabled ? "gray" : "currentColor"}
      width="20"
      height="20"
      viewBox="0 0 24 24"
    >
      <polygon points="15.293 3.293 6.586 12 15.293 20.707 16.707 19.293 9.414 12 16.707 4.707 15.293 3.293" />
    </svg>
  );
}
