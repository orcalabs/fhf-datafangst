import { format, isToday, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";

// Prevents all input from keys not related to input of a natural number
export const numberInputLimiter = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (
    !(e.key >= "0" && e.key <= "9") &&
    e.key !== "Delete" &&
    e.key !== "Backspace" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight" &&
    e.key !== "Home" &&
    e.key !== "End" &&
    e.key !== "Shift"
  ) {
    e.preventDefault();
    return;
  }
};

export type IntoDate = Date | number | string;

export const dateFormat = (d: IntoDate | undefined | null, f: string) => {
  if (!d) {
    return "";
  }

  if (isToday(d)) {
    return `I dag, ${format(new Date(d), "HH:mm", { locale: nb })}`;
  }

  if (isYesterday(d)) {
    return `I går, ${format(new Date(d), "HH:mm", { locale: nb })}`;
  }

  return d ? format(new Date(d), f, { locale: nb }) : "";
};
