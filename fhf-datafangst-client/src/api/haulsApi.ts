import { apiConfiguration, apiGet, axiosInstance } from ".";
import { setMonth, setYear } from "date-fns";
import { GearGroup, SpeciesGroup, V1haulApi } from "generated/openapi";
import { LengthGroup } from "models";

export interface HaulsArgs {
  years?: number[];
  months?: number[];
  catchLocations?: string[];
  gearGroupIds?: GearGroup[];
  speciesGroupIds?: SpeciesGroup[];
  vesselLengthRanges?: LengthGroup[];
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

const createVesselLengthQueryString = (vesselLengthRanges?: LengthGroup[]) => {
  if (!vesselLengthRanges) {
    return undefined;
  }

  let res = "";
  for (const l of vesselLengthRanges) {
    if (l.max === Infinity) {
      res += "[" + l.min.toString() + ",)";
    } else {
      res += "[" + l.min.toString() + "," + l.max.toString() + ")";
    }
  }

  return res;
};

const api = new V1haulApi(apiConfiguration, undefined, axiosInstance);

export const getHauls = async (query: HaulsArgs) =>
  apiGet(async () =>
    api.hauls({
      months: query.years
        ? createTimestampsFromYearsMonths(query.years, query.months)
            .map((g) => g.toISOString())
            .toString()
        : undefined,
      catchLocations: query.catchLocations?.join(","),
      gearGroupIds: query.gearGroupIds?.map((g) => g.id).toString(),
      speciesGroupIds: query.speciesGroupIds?.map((g) => g.id).toString(),
      vesselLengthRanges: createVesselLengthQueryString(
        query.vesselLengthRanges,
      ),
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
      gearGroupIds: query.gearGroupIds?.map((g) => g.id).toString(),
      speciesGroupIds: query.speciesGroupIds?.map((g) => g.id).toString(),
      vesselLengthRanges: createVesselLengthQueryString(
        query.vesselLengthRanges,
      ),
    }),
  );
