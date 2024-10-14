function FishLocationIcon(props) {
  const fill = props.fill || "currentColor";
  const width = props.width || 24;
  const height = props.height || 24;

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="153.419 85.232 184.501 213"
    >
      <polygon
        points="270.82 230.432 270.82 230.432 220.52 201.333 186.92 220.833 170.22 211.133 203.72 191.732 170.22 172.432 186.92 162.632 220.52 181.932 270.82 152.932 337.92 191.732"
        fill={fill}
      />
      <polygon
        className="st0"
        points="220.52 162.732 220.52 162.732 270.82 133.632 304.42 153.132 321.12 143.432 287.52 123.932 321.12 104.532 304.42 94.932 270.82 114.232 220.52 85.232 153.42 123.932"
        fill={fill}
      />
      <g transform="matrix(1, 0, 0, 1, 117.819275, 55.032284)">
        <polygon
          className="st0"
          points="102.7,243.2 102.7,243.2 153,214 186.6,233.5 203.3,223.8 169.7,204.3 203.3,185 186.6,175.3 &#10;&#9;&#9;153,194.7 102.7,165.6 35.6,204.3 &#9;"
          fill={fill}
        />
      </g>
    </svg>
  );
}

export default FishLocationIcon;
