interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

function FishValuePerFuelIcon({
  fill = "currentColor",
  width = 48,
  height = 48,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="35 0 265 230"
      aria-hidden="true"
    >
      {/* Scale beam */}
      <path
        fill={fill}
        d="
          M68 70
          L250 40
          L256 63
          L74 93
          Z
        "
      />

      {/* Center pivot */}
      <circle cx="160" cy="66" r="17" fill={fill} />

      {/* Pivot opening */}
      <circle cx="160" cy="66" r="7" fill="white" />

      {/* Top cap */}
      <circle cx="160" cy="27" r="18" fill={fill} />

      {/* Main support */}
      <path
        fill={fill}
        d="
          M149 80
          H171
          V164

          C171 183 180 194 195 200

          C205 204 212 209 216 218

          H104

          C108 209 115 204 125 200

          C140 194 149 183 149 164

          Z
        "
      />

      {/* Left suspension thread */}
      <path
        fill={fill}
        d="
          M68 83
          H77
          V112
          H68
          Z
        "
      />

      {/* Right suspension thread */}
      <path
        fill={fill}
        d="
          M243 49
          H252
          V94
          H243
          Z
        "
      />

      {/* Fish */}
      <g
        transform="
          translate(72 160)
          rotate(-90)
          scale(0.40 0.50)
          translate(-156.5 -72.4)
        "
      >
        <polygon
          fill={fill}
          points="
            187.8,144.8
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

      {/* Large oil / fuel drop */}
      <path
        fill={fill}
        d="
          M248 84

          C248 84
          204 132 204 154

          C204 180 222 197 248 197

          C274 197 292 180 292 154

          C292 132 248 84 248 84

          Z
        "
      />

      {/* Drop highlight */}
      <path
        d="
          M231 143
          C231 157 238 164 250 166
        "
        fill="none"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FishValuePerFuelIcon;
