import { apiConfiguration, apiGet } from ".";
import { setMonth, setYear } from "date-fns";
import { V1haulApi } from "generated/openapi";

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
    months = Array.from(new Array(12), (_, i) => i + 1);
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

const api = new V1haulApi(apiConfiguration);

export const getHauls = async (query: HaulsArgs) =>
  apiGet(async () =>
    api.hauls({
      months: query.years
        ? createTimestampsFromYearsMonths(query.years, query.months)
            .map((g) => g.toISOString())
            .toString()
        : undefined,
      catchLocations: query.catchLocations?.join(","),
    }),
  );

export const getHaulsGrid = async (query: HaulsArgs) =>
  apiGet(async () =>
    api.haulsGrid({
      months: query.years
        ? createTimestampsFromYearsMonths(query.years, query.months)
            .map((g) => g.toISOString())
            .toString()
        : undefined,
      catchLocations: query.catchLocations?.join(","),
    }),
  );
