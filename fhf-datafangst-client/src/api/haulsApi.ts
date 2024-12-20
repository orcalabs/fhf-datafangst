import {
  ActiveHaulsFilter,
  GearGroupDetailed,
  HaulApi,
  HaulsSorting,
  Ordering,
  SpeciesGroupDetailed,
  Vessel,
} from "generated/openapi";
import { LengthGroup } from "models";
import { MinErsYear } from "utils";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";
import { createTimestampsFromYearsMonths } from "./utils";

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
  gearGroupIds?: GearGroupDetailed[];
  speciesGroupIds?: SpeciesGroupDetailed[];
  vesselLengthGroups?: LengthGroup[];
  filter?: HaulsFilter;
  ordering?: Ordering;
  sorting?: HaulsSorting;
}

const api = new HaulApi(apiConfiguration, undefined, axiosInstance);

export const getHauls = async (query: HaulsArgs) =>
  apiGet(async () =>
    api.routesV1HaulHauls({
      months: query.years
        ? createTimestampsFromYearsMonths(
            query.years,
            query.months,
            MinErsYear,
          )?.map((g) => g.toISOString())
        : undefined,
      fiskeridirVesselIds: query.vessels?.map((v) => v.fiskeridir.id),
      catchLocations: query.catchLocations,
      gearGroupIds: query.gearGroupIds?.map((g) => g.id),
      speciesGroupIds: query.speciesGroupIds?.map((g) => g.id),
      vesselLengthGroups: query.vesselLengthGroups?.map((g) => g.id),
      ordering: query?.ordering ?? Ordering.Desc,
      sorting: query.sorting ?? HaulsSorting.StartDate,
    }),
  );

export const getHaulsMatrix = async (query: HaulsArgs) =>
  apiGet(async () =>
    api.routesV1HaulHaulsMatrix({
      activeFilter:
        query.filter === HaulsFilter.Vessel
          ? ActiveHaulsFilter.VesselLength
          : (query.filter as ActiveHaulsFilter),
      months:
        query.filter === HaulsFilter.Date
          ? undefined
          : createTimestampsFromYearsMonths(
              query.years,
              query.months,
              MinErsYear,
            )?.map((d) => d.getFullYear() * 12 + d.getMonth()),
      fiskeridirVesselIds: query.vessels?.map((v) => v.fiskeridir.id),
      catchLocations: query.catchLocations,
      gearGroupIds:
        query.filter === HaulsFilter.GearGroup
          ? undefined
          : query.gearGroupIds?.map((g) => g.id),
      speciesGroupIds:
        query.filter === HaulsFilter.SpeciesGroup
          ? undefined
          : query.speciesGroupIds?.map((g) => g.id),
      vesselLengthGroups:
        query.filter === HaulsFilter.VesselLength
          ? undefined
          : query.vesselLengthGroups?.map((l) => l.id),
    }),
  );
