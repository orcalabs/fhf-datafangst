import { apiConfiguration, apiGet, axiosInstance } from ".";
import {
  ActiveLandingFilter,
  GearGroupDetailed,
  LandingsSorting,
  Ordering,
  SpeciesGroupDetailed,
  V1landingApi,
  Vessel,
} from "generated/openapi";
import { LengthGroup } from "models";
import {
  createTimestampsFromYearsMonths,
  createVesselLengthQueryString,
} from "./utils";
import { MinLandingYear } from "utils";

export const LandingsFilter = {
  ...ActiveLandingFilter,
  Vessel: "vessel",
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type LandingsFilter =
  (typeof LandingsFilter)[keyof typeof LandingsFilter];

export interface LandingsArgs {
  years?: number[];
  months?: number[];
  vessels?: Vessel[];
  catchLocations?: string[];
  gearGroupIds?: GearGroupDetailed[];
  speciesGroupIds?: SpeciesGroupDetailed[];
  vesselLengthRanges?: LengthGroup[];
  filter?: LandingsFilter;
  ordering?: Ordering;
  sorting?: LandingsSorting;
}

const api = new V1landingApi(apiConfiguration, undefined, axiosInstance);

export const getLandings = async (query: LandingsArgs) =>
  apiGet(async () =>
    api.landings({
      months: query.years
        ? createTimestampsFromYearsMonths(
            query.years,
            query.months,
            MinLandingYear,
          )
            ?.map((g) => g.toISOString())
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
      ordering: query?.ordering ?? Ordering.Desc,
      sorting: query.sorting ?? LandingsSorting.LandingTimestamp,
    }),
  );

export const getLandingsMatrix = async (query: LandingsArgs) =>
  apiGet(async () =>
    api.landingMatrix({
      activeFilter:
        query.filter === LandingsFilter.Vessel
          ? ActiveLandingFilter.VesselLength
          : (query.filter as ActiveLandingFilter),
      months:
        query.filter === LandingsFilter.Date
          ? undefined
          : createTimestampsFromYearsMonths(
              query.years,
              query.months,
              MinLandingYear,
            )
              ?.map((d) => d.getFullYear() * 12 + d.getMonth())
              .join(","),
      fiskeridirVesselIds: query.vessels
        ?.map((v) => v.fiskeridir.id)
        .toString(),
      catchLocations: query.catchLocations?.join(","),
      gearGroupIds:
        query.filter === LandingsFilter.GearGroup
          ? undefined
          : query.gearGroupIds?.map((g) => g.id).toString(),
      speciesGroupIds:
        query.filter === LandingsFilter.SpeciesGroup
          ? undefined
          : query.speciesGroupIds?.map((g) => g.id).toString(),
      vesselLengthGroups:
        query.filter === LandingsFilter.VesselLength
          ? undefined
          : query.vesselLengthRanges?.map((l) => l.id).join(","),
    }),
  );
