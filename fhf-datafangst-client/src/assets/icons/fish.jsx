function FishIcon(props) {
  const fill = props.fill || "currentColor";
  const width = props.width || 48;
  const height = props.height || 48;

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 313 144.8"
    >
      <g>
        <polygon
          fill={fill}
          points="187.8,144.8 187.8,144.8 93.8,90.3 31.3,126.6 0,108.7 62.5,72.4 0,36.3 31.3,18.2 93.8,54.2 187.8,0 
		313,72.4 	"
        />
      </g>
    </svg>
  );
}

export default FishIcon;
