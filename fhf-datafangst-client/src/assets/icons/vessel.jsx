function VesselIcon(props) {
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
      viewBox="0 0 359.3 182.5"
    >
      <path
        fill={fill}
        d="M359.3,73L317.1,73l42.2-73H190.4l-21.1,36.5h42.1h0.1h0l0.1,0.1l-0.2-0.1l-42.2,73h0h-42.2h0h0h0h0L63.7,0.1
	H21.5l42,73h-0.1l-21.1,36.5H0l42.2,73h253.6L359.3,73z M232.6,73L232.6,73l21.1-36.5h42.2l0,0.1l-21,36.5H232.6z"
      />
    </svg>
  );
}

export default VesselIcon;
