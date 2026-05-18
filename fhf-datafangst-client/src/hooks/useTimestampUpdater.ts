import { addMinutes, startOfMinute } from "date-fns";
import { useEffect, useState } from "react";

export const useTimestampUpdater = () => {
  const getMinute = () => startOfMinute(new Date());

  const [time, setTime] = useState(getMinute());

  useEffect(() => {
    let intervalId: any;

    const now = new Date();
    const nextMinute = addMinutes(startOfMinute(now), 1);
    const delay = nextMinute.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      setTime(getMinute());

      intervalId = setInterval(() => {
        setTime(getMinute());
      }, 60000);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return time;
};
