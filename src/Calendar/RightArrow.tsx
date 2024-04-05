export default function RightArrow({ isDisabled }: { isDisabled: boolean }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isDisabled ? "gray" : "currentColor"}
            width="20"
            height="20"
            viewBox="0 0 24 24"
        >
            <polygon points="7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707" />
        </svg>
    );
}
