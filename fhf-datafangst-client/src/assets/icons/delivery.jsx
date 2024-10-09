function DeliveryIcon(props) {
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
      viewBox="0 0 269.3 269.3"
    >
      <polygon
        fill={fill}
        points="77.2,193.5 41.1,172.7 41.1,235.4 77.2,214.4 181.4,245.9 253.7,204.1 181.4,162.2 "
      />
      <polygon
        fill={fill}
        points="77.2,56.1 41.1,35.3 41.1,97.9 77.2,76.9 181.4,108.5 253.7,66.6 181.4,24.8 "
      />
      <polygon
        fill={fill}
        points="183.1,124.8 219.3,104 219.3,166.7 183.1,145.7 79,177.2 6.6,135.3 79,93.5 "
      />
    </svg>
  );
}

export default DeliveryIcon;
