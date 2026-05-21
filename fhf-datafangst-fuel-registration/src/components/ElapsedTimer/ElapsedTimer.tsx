import { differenceInSeconds } from "date-fns";
import { useEffect, useState, type FC } from "react";

interface Props {
  startTimestamp: Date | string | number;
}

export const ElapsedTimer: FC<Props> = ({ startTimestamp }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const start = new Date(startTimestamp);

    const update = () => {
      setSeconds(differenceInSeconds(new Date(), start));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <span>
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(secs).padStart(2, "0")}
    </span>
  );
};
