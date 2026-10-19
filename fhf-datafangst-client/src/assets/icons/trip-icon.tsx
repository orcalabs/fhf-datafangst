interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

function FishingTripIcon({
  fill = "currentColor",
  width = 48,
  height = 48,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 320 320"
      fill="none"
      aria-hidden="true"
    >
      {/* Route leading up to the front of the vessel */}
      <path
        d="
          M45 45
          C45 15 275 15 275 115
          C275 170 260 140 248 138
        "
        stroke={fill}
        strokeWidth="30"
        strokeLinecap="round"
        strokeDasharray="3 42"
      />

      {/* Route continuing from the back of the vessel */}
      <path
        d="
          M42 158
          C35 185 45 200 45 205
          C45 295 275 295 275 275
        "
        stroke={fill}
        strokeWidth="30"
        strokeLinecap="round"
        strokeDasharray="3 42"
      />

      {/* Start marker */}
      <circle cx="45" cy="45" r="15" fill={fill} />
      <circle cx="45" cy="45" r="6" fill="white" />

      {/* Destination marker */}
      <circle cx="275" cy="275" r="15" stroke={fill} strokeWidth="9" />
      <circle cx="275" cy="275" r="5" fill={fill} />

      {/* Larger, upright vessel — flipped horizontally to face right */}
      <g
        transform="
          translate(135 140)
          scale(-0.65 0.65)
          translate(-199.65 -91.25)
        "
      >
        <path
          fill={fill}
          d="
            M359.3,73L317.1,73l42.2-73H190.4l-21.1,36.5h42.1h0.1h0
            l0.1,0.1l-0.2-0.1l-42.2,73h0h-42.2h0h0h0h0L63.7,0.1
            H21.5l42,73h-0.1l-21.1,36.5H0l42.2,73h253.6L359.3,73z
            M232.6,73L232.6,73l21.1-36.5h42.2l0,0.1l-21,36.5H232.6z
          "
        />
      </g>
    </svg>
  );
}

export default FishingTripIcon;
