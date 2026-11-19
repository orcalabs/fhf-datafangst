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
      {/* Route approaching the vessel */}
      <path
        d="
          M45 73
          C45 25 265 22 270 94
          C275 132 242 145 219 151
        "
        stroke={fill}
        strokeWidth="16"
        strokeDasharray="22 25"
        strokeLinecap="round"
      />

      {/* Route leaving the vessel */}
      <path
        d="
          M102 176
          C56 176 42 205 49 239
          C58 291 214 298 272 266
        "
        stroke={fill}
        strokeWidth="16"
        strokeDasharray="22 25"
        strokeLinecap="round"
      />

      {/* Start marker */}
      <circle cx="45" cy="73" r="17" fill={fill} />
      <circle cx="45" cy="73" r="7" fill="white" />

      {/* Destination marker */}
      <circle cx="272" cy="266" r="17" stroke={fill} strokeWidth="9" />

      {/* Vessel rotated 35 degrees */}
      <g transform="rotate(35 160 160)">
        {/* 15% narrower, maintaining center position */}
        <g transform="translate(24 0) scale(0.85 1)">
          {/* Main hull with sharp bow */}
          <path
            d="
              M160 57
              C155 57 119 109 112 140
              L112 211
              Q160 242 208 211
              L208 140
              C201 109 165 57 160 57
              Z
            "
            fill={fill}
          />

          {/* Cabin */}
          <path
            d="
              M140 151
              L180 151
              L188 196
              Q160 211 132 196
              Z
            "
            fill="white"
          />

          {/* Stern detail */}
          <path
            d="M140 213 L180 213"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Bow detail */}
          <path
            d="M160 98 L160 129"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}

export default FishingTripIcon;
