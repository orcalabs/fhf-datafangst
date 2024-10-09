function DeliveryPointIcon(props) {
  const fill = props.fill || "currentColor";
  const width = props.width || 24;
  const height = props.height || 24;
  const x = props.x || "0px";
  const y = props.y || "0px";

  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox="0 0 379.2 320.1"
    >
      <path
        fill={fill}
        d="M189.8,0L0,109.4l0.1,0.2H0v210.5h379.2V109.6L189.8,0z M207.9,270.4L114.2,216l-62.4,36.2v-54.6v-53.5
	l62.4,35.9l93.7-54l124.8,72.2L207.9,270.4z"
      />
    </svg>
  );
}

export default DeliveryPointIcon;
