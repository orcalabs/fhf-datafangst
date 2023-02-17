import { format } from "date-fns";
import { nb } from "date-fns/locale";

export type IntoDate = Date | number | string;

export const dateFormat = (d: IntoDate | undefined, f: string) =>
  d ? format(new Date(d), f, { locale: nb }) : "";
