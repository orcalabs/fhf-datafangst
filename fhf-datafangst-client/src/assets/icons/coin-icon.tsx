interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

function CoinStackIcon({
  fill = "currentColor",
  width = 48,
  height = 48,
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://w3.org"
    >
      {/* 1. FIRST COIN OF MAIN STACK (Rendered first so it sits underneath) */}
      <g>
        {/* Base Side / Thick Edge */}
        <path
          d="M18 31C18 34.866 30.088 38 45 38C59.912 38 72 34.866 72 31V43C72 46.866 59.912 50 45 50C30.088 50 18 46.866 18 43V31Z"
          fill={fill}
        />
        {/* Flat Top Surface */}
        <ellipse cx="45" cy="31" rx="27" ry="7" fill={fill} />
        {/* Inner Detailed Rim Lining */}
        <ellipse
          cx="45"
          cy="31"
          rx="22"
          ry="5"
          fill="none"
          stroke="var(--icon-bg, #ffffff)"
          strokeWidth="1.5"
        />
      </g>

      {/* 2. LOWER COINS */}
      {/* Coin 2 Segment */}
      <path
        d="M18 46C18 49.866 30.088 53 45 53C59.912 53 72 49.866 72 46V58C72 61.866 59.912 65 45 65C30.088 65 18 61.866 18 58V46Z"
        fill={fill}
      />

      {/* Coin 3 Segment */}
      <path
        d="M18 61C18 64.866 30.088 68 45 68C59.912 68 72 64.866 72 61V73C72 76.866 59.912 80 45 80C30.088 80 18 76.866 18 73V61Z"
        fill={fill}
      />

      {/* Coin 4 Segment (Bottom Base) */}
      <path
        d="M18 76C18 79.866 30.088 83 45 83C59.912 83 72 79.866 72 76V88C72 91.866 59.912 95 45 95C30.088 95 18 91.866 18 88V76Z"
        fill={fill}
      />

      {/* 3. TOP OFFSET COIN (Rendered last so its geometry overlays on top of the stack) */}
      <g>
        {/* Base Side / Thick Edge */}
        <path
          d="M31 16C31 19.866 43.088 23 58 23C72.912 23 85 19.866 85 16V26C85 29.866 72.912 33 58 33C43.088 33 31 29.866 31 26V16Z"
          fill={fill}
        />
        {/* Flat Top Surface */}
        <ellipse cx="58" cy="16" rx="27" ry="7" fill={fill} />
        {/* Inner Detailed Rim Lining */}
        <ellipse
          cx="58"
          cy="16"
          rx="22"
          ry="5"
          fill="none"
          stroke="var(--icon-bg, #ffffff)"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

export default CoinStackIcon;
