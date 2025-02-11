import {
  ActiveLandingFilter,
  GearGroupDetailed,
  LandingApi,
  LandingsSorting,
  Ordering,
  SpeciesGroupDetailed,
  Vessel,
} from "generated/openapi";
import { LengthGroup } from "models";
import { MinLandingYear } from "utils";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";
import { createTimestampsFromYearsMonths } from "./utils";

export type LandingsFilter = ActiveLandingFilter;
export const LandingsFilter = ActiveLandingFilter;

export interface LandingsMatrixArgs {
  filter: LandingsFilter;
  years?: number[];
  months?: number[];
  vessels?: Vessel[];
  catchLocations?: string[];
  gearGroupIds?: GearGroupDetailed[];
  speciesGroupIds?: SpeciesGroupDetailed[];
  vesselLengthGroups?: LengthGroup[];
}

export interface LandingsArgs {
  years?: number[];
  months?: number[];
  vessels?: Vessel[];
  catchLocations?: string[];
  gearGroupIds?: GearGroupDetailed[];
  speciesGroupIds?: SpeciesGroupDetailed[];
  vesselLengthGroups?: LengthGroup[];
  ordering?: Ordering;
  sorting?: LandingsSorting;
  limit?: number;
  page?: number;
}

const api = new LandingApi(apiConfiguration, undefined, axiosInstance);

export const getLandings = apiFn((query: LandingsArgs, signal) =>
  api.routesV1LandingLandings(
    {
      months: query.years
        ? createTimestampsFromYearsMonths(
            query.years,
            query.months,
            MinLandingYear,
          )?.map((g) => g.toISOString())
        : undefined,
      fiskeridirVesselIds: query.vessels?.map((v) => v.fiskeridir.id),
      catchLocations: query.catchLocations,
      gearGroupIds: query.gearGroupIds?.map((g) => g.id),
      speciesGroupIds: query.speciesGroupIds?.map((g) => g.id),
      vesselLengthGroups: query.vesselLengthGroups?.map((g) => g.id),
      ordering: query.ordering ?? Ordering.Desc,
      sorting: query.sorting ?? LandingsSorting.LandingTimestamp,
      limit: query.limit,
      offset:
        query.limit != undefined && query.page !== undefined
          ? query.limit * query.page
          : undefined,
    },
    { signal },
  ),
);

export const getLandingsMatrix = apiFn((query: LandingsMatrixArgs, signal) =>
  api.routesV1LandingLandingMatrix(
    {
      activeFilter: query.filter,
      months:
        query.filter === LandingsFilter.Date
          ? undefined
          : createTimestampsFromYearsMonths(
              query.years,
              query.months,
              MinLandingYear,
            )?.map((d) => d.getFullYear() * 12 + d.getMonth()),
      fiskeridirVesselIds: query.vessels?.map((v) => v.fiskeridir.id),
      catchLocations: query.catchLocations,
      gearGroupIds:
        query.filter === LandingsFilter.GearGroup
          ? undefined
          : query.gearGroupIds?.map((g) => g.id),
      speciesGroupIds:
        query.filter === LandingsFilter.SpeciesGroup
          ? undefined
          : query.speciesGroupIds?.map((g) => g.id),
      vesselLengthGroups:
        query.filter === LandingsFilter.VesselLength
          ? undefined
          : query.vesselLengthGroups?.map((l) => l.id),
    },
    { signal },
  ),
);
