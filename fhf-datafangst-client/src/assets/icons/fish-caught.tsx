interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

function FishInNetIcon({
  fill = "currentColor",
  width = 48,
  height = 48,
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 320 240"
      aria-hidden="true"
    >
      {/* Net frame / rim */}
      <path
        d="
          M62 42
          C42 67 36 103 42 139
          C49 180 78 207 117 218
        "
        fill="none"
        stroke={fill}
        strokeWidth="10"
        strokeLinecap="round"
      />

      <path
        d="
          M62 42
          C94 25 132 22 169 27
          C205 32 237 47 258 70
        "
        fill="none"
        stroke={fill}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Net mesh - left */}
      <path
        d="M49 72 L106 184"
        fill="none"
        stroke={fill}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M43 104 L91 194"
        fill="none"
        stroke={fill}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M43 139 L76 199"
        fill="none"
        stroke={fill}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Net mesh - right */}
      <path
        d="M96 29 L145 212"
        fill="none"
        stroke={fill}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M139 26 L176 205"
        fill="none"
        stroke={fill}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M184 31 L205 190"
        fill="none"
        stroke={fill}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M222 45 L232 162"
        fill="none"
        stroke={fill}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Fish */}
      <g transform="translate(35 73) scale(0.72)">
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

      {/* Net bottom */}
      <path
        d="
          M76 199
          C91 216 110 224 132 225
          C159 227 184 217 205 198
        "
        fill="none"
        stroke={fill}
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Net handle */}
      <path
        d="
          M258 70
          L285 40
        "
        fill="none"
        stroke={fill}
        strokeWidth="10"
        strokeLinecap="round"
      />

      <circle cx="289" cy="36" r="9" fill={fill} />
    </svg>
  );
}

export default FishInNetIcon;
