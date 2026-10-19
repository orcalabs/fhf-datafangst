interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

function FuiIcon({ fill = "currentColor", width = 48, height = 48 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 132 164"
      fill={fill}
    >
      <path
        fillRule="evenodd"
        d="M53.5 5 L113 4.5 L118 6.5 L125.5 15 L126.5 18 L126.5 144 L124.5 149 L119 154.5 L113 157.5 L29 157.5 L22 154.5 L17.5 150 L15.5 146 L14.5 143 L14.5 58 L16.5 53 L13 50 L8 44 L5 38 L6 32 L11 26 L17 21 L21 20 L25 23 L28 29 L38 26 L44 18 L49 10 Z M55.5 14 L109 13.5 L109.5 17 L105.5 24 L103 26.5 L51 26.5 L49.5 23 Z M78.6 130 L52.8 108.9 L35.6 123 L27 116 L44.2 102 L27 88 L35.6 81 L52.8 95 L78.6 74 L113 102 Z"
      />
    </svg>
  );
}

export default FuiIcon;
