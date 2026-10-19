interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

function CalendarFishIcon({
  fill = "currentColor",
  width = 48,
  height = 48,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="8.5"
        width="40"
        height="36"
        rx="4"
        stroke={fill}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />

      <path
        d="M4.5 20 H43.5"
        stroke={fill}
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      <path
        d="M14.5 4.5 V13"
        stroke={fill}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M33.5 4.5 V13"
        stroke={fill}
        strokeWidth="5"
        strokeLinecap="round"
      />

      <g transform="translate(9.5 25) scale(0.092)">
        <polygon
          fill={fill}
          points="
        187.8,144.8
        93.8,90.3
        31.3,126.6
        0,108.7
        62.5,72.4
        0,36.3
        31.3,18.2
        93.8,54.2
        187.8,0
        313,72.4
      "
        />
      </g>
    </svg>
  );
}

export default CalendarFishIcon;
