interface Props {
  fill?: string;
  width?: string | number;
  height?: string | number;
}

function GearIcon({ fill = "currentColor", width = 48, height = 48 }: Props) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={width}
      height={height}
      viewBox="0 0 210.8 265"
    >
      <path
        fill={fill}
        d="M191.7,132.5l-19.2-33.1l38.3-66.3L191.5,0h-76.6L95.8,33.1l57.5,99.3l-19.1,33.1l19.2,33.1l-19.2,33.2H57.5
	l-19.2-33.1l19.1-33l19.1,33l19.2-33.1L57.3,99.3L0,198.7L38.6,265h114.9l38.3-66.3l-19.2-33.1L191.7,132.5z M134.1,33.1L134.1,33.1
	L134.1,33.1z M153.4,132.5L153.4,132.5L153.4,132.5z M153.4,66.2l-19.2-33.1h38.3L153.4,66.2z"
      />
    </svg>
  );
}

export default GearIcon;
