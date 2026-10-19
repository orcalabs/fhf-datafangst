interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}
function FishPerDistanceIcon({
  fill = "currentColor",
  width = 48,
  height = 48,
}: Props) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 313 210"
      aria-hidden="true"
    >
      {" "}
      {/* Fish */}{" "}
      <g>
        {" "}
        <polygon
          fill={fill}
          points=" 187.8,144.8 187.8,144.8 93.8,90.3 31.3,126.6 0,108.7 62.5,72.4 0,36.3 31.3,18.2 93.8,54.2 187.8,0 313,72.4 "
        />{" "}
      </g>{" "}
      {/* Distance indicator */}{" "}
      <g
        fill="none"
        stroke={fill}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        {/* Main distance line */} <path d="M25 178 H288" />{" "}
        {/* Distance markers */} <path d="M25 163 V193" />{" "}
        <path d="M157 163 V193" /> <path d="M288 163 V193" />{" "}
      </g>{" "}
      {/* Direction arrow */}{" "}
      <path
        fill={fill}
        d=" M235 178 L215 164 V172 H185 V184 H215 V192 Z "
      />{" "}
    </svg>
  );
}
export default FishPerDistanceIcon;
