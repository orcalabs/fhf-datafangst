import { apiConfiguration, apiGet, axiosInstance } from ".";
import { setMonth, setYear } from "date-fns";
import {
  ActiveHaulsFilter,
  GearGroup,
  SpeciesGroup,
  V1haulApi,
  Vessel,
} from "generated/openapi";
import { LengthGroup } from "models";
import { getAllYearsArray } from "components/Filters/YearsFilter";

export const HaulsFilter = {
  ...ActiveHaulsFilter,
  Vessel: "vessel",
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HaulsFilter = (typeof HaulsFilter)[keyof typeof HaulsFilter];

export interface HaulsArgs {
  years?: number[];
  months?: number[];
  vessels?: Vessel[];
  catchLocations?: string[];
  gearGroupIds?: GearGroup[];
  speciesGroupIds?: SpeciesGroup[];
  vesselLengthRanges?: LengthGroup[];
  filter?: HaulsFilter;
}

const createTimestampsFromYearsMonths = (
  years: number[] | undefined,
  months: number[] | undefined,
) => {
  if (!years?.length && !months?.length) {
    return [];
  }

  if (!years?.length) {
    years = getAllYearsArray();
  }
  if (!months?.length) {
    months = Array.from({ length: 12 }, (_, i) => i + 1);
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

    res += ";";
  }

  // Remove last semicolon
  if (res.length) {
    res = res.slice(0, -1);
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
      fiskeridirVesselIds: query.vessels
        ?.map((v) => v.fiskeridir.id)
        .toString(),
      catchLocations: query.catchLocations?.join(","),
      gearGroupIds: query.gearGroupIds?.map((g) => g.id).toString(),
      speciesGroupIds: query.speciesGroupIds?.map((g) => g.id).toString(),
      vesselLengthRanges: createVesselLengthQueryString(
        query.vesselLengthRanges,
      ),
    }),
  );

export const getHaulsMatrix = async (query: HaulsArgs) =>
  apiGet(async () =>
    api.haulsMatrix({
      activeFilter:
        query.filter === HaulsFilter.Vessel
          ? ActiveHaulsFilter.VesselLength
          : (query.filter as ActiveHaulsFilter),
      months:
        query.filter === HaulsFilter.Date
          ? undefined
          : createTimestampsFromYearsMonths(query.years, query.months)
              .map((d) => d.getFullYear() * 12 + d.getMonth())
              .join(","),
      fiskeridirVesselIds: query.vessels
        ?.map((v) => v.fiskeridir.id)
        .toString(),
      catchLocations: query.catchLocations?.join(","),
      gearGroupIds:
        query.filter === HaulsFilter.GearGroup
          ? undefined
          : query.gearGroupIds?.map((g) => g.id).toString(),
      speciesGroupIds:
        query.filter === HaulsFilter.SpeciesGroup
          ? undefined
          : query.speciesGroupIds?.map((g) => g.id).toString(),
      vesselLengthGroups:
        query.filter === HaulsFilter.VesselLength
          ? undefined
          : query.vesselLengthRanges?.map((l) => l.id).join(","),
    }),
  );
