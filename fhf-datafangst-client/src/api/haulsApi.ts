import { apiGet } from ".";
import { Haul } from "models";
import { setMonth, setYear } from "date-fns";

export interface HaulsArgs {
  years?: number[];
  months?: number[];
  catchLocations?: string[];
}

const createTimestampsFromYearsMonths = (
  years: number[] | undefined,
  months: number[] | undefined,
) => {
  if (!years?.length) {
    return [];
  }
  if (!months?.length) {
    months = Array.from(new Array(12), (x, i) => i + 1);
  }
  const timestamps: Date[] = [];
  for (const month of months) {
    const date = setMonth(new Date(), month - 1);
    for (const year of years) {
      timestamps.push(setYear(date, year));
    }
  }

  return timestamps;
};

export const getHauls = async (query: HaulsArgs) =>
  apiGet<Haul[]>("hauls", {
    months: query.years
      ? createTimestampsFromYearsMonths(query.years, query.months)
          .map((g) => g.toISOString())
          .toString()
      : undefined,
  });
