function LogoIcon(props) {
  const fill = props.fill || "#ffffff";
  const width = props.width;
  const height = props.height;

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 150 395.3 295.3"
      // style="enable-background:new 0 0 841.9 595.3;"
    >
      <g>
        <g>
          <polygon
            fill={fill}
            points="283.9,357.6 283.9,357.6 237.3,330.6 206.3,348.6 190.8,339.7 221.8,321.7 190.8,303.8 206.3,294.8 
          237.3,312.7 283.9,285.8 346,321.7 		"
          />
          <polygon
            fill={fill}
            points="237.3,294.8 237.3,294.8 283.9,267.8 315,285.8 330.5,276.8 299.4,258.8 330.5,240.9 315,231.9 
          283.9,249.8 237.3,223 175.2,258.8 		"
          />
        </g>
      </g>
    </svg>
  );
}

export default LogoIcon;
