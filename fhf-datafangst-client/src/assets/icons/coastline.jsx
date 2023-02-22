/* eslint no-use-before-define: 2 */
function CoastlineIcon(props) {
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
        points="60.9,251.8 60.9,251.8 60.9,251.8 60.9,251.9 60.9,251.8 87.8,251.8 60.9,205.3 60.9,205.3 74.4,182 
	101.3,182 114.7,158.8 195.5,158.8 222.5,112.2 222.5,112.2 209,88.9 235.9,42.4 236,42.4 222.5,19.1 195.6,19.1 209,42.4 209,42.4 
	182.1,89 195.5,112.2 195.5,112.2 182,135.5 101.3,135.5 87.8,158.7 60.9,158.7 34,205.3 "
      />
    </svg>
  );
}

export default CoastlineIcon;
