interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
  strokeWidth?: number;
}

function EngineIcon({
  fill = "currentColor",
  width = 48,
  height = 48,
  strokeWidth = 5,
}: Props) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 70 52"
      fill="none"
      stroke={fill}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        {/* Engine body */}
        <path d="M15 19 H19 V14 H50 V22 H58 V19 H65 V37 H58 V33 H51 V44 H33 L23 37 H15 Z" />

        {/* Left connector */}
        <path d="M4 19 V37" />
        <path d="M4 28 H15" />

        {/* Top connector */}
        <path d="M35 14 V5" />
        <path d="M21 5 H49" />
      </g>
    </svg>
  );
}

export default EngineIcon;
