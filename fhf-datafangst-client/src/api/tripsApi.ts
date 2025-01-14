import { DateRange } from "components/MainMenu/SearchFilters/DateFilter";
import {
  GearGroupDetailed,
  Haul,
  Landing,
  Ordering,
  SpeciesGroupDetailed,
  TripApi,
  TripSorting,
  Vessel,
} from "generated/openapi";
import { LengthGroup } from "models";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface TripsArgs {
  vessels?: Vessel[];
  deliveryPoints?: string[];
  dateRange?: DateRange;
  weight?: [number, number];
  vesselLengthGroups?: LengthGroup[];
  speciesGroups?: SpeciesGroupDetailed[];
  gearGroups?: GearGroupDetailed[];
  sorting?: [TripSorting, Ordering];
  offset?: number;
  limit?: number;
  accessToken?: string;
}

export interface CurrentTripArgs {
  vessel: Vessel;
  accessToken?: string;
}

const api = new TripApi(apiConfiguration, undefined, axiosInstance);

export const getTripFromHaul = async (haul: Haul) =>
  apiGet(async () =>
    api.routesV1TripTripOfHaulTripOfHaul({
      haulId: haul.haulId,
    }),
  );

export const getTripFromLanding = async (landing: Landing) =>
  apiGet(async () =>
    api.routesV1TripTripOfLanding({
      landingId: landing.id,
    }),
  );

export const getTrips = async (query: TripsArgs) =>
  apiGet(async () =>
    api.routesV1TripTrips({
      fiskeridirVesselIds: query.vessels?.map((v) => v.fiskeridir.id),
      deliveryPoints: query.deliveryPoints,
      startDate: query.dateRange?.start?.toISOString(),
      endDate: query.dateRange?.end?.toISOString(),
      gearGroupIds: query.gearGroups?.map((gg) => gg.id),
      minWeight: query.weight ? query.weight[0] : undefined,
      maxWeight: query.weight ? query.weight[1] : undefined,
      vesselLengthGroups: query.vesselLengthGroups?.map((lg) => lg.id),
      speciesGroupIds: query.speciesGroups?.map((sg) => sg.id),
      sorting: query.sorting ? query.sorting[0] : TripSorting.StopDate,
      ordering: query.sorting ? query.sorting[1] : Ordering.Desc,
      limit: query.limit ?? 10,
      offset: query.offset ?? 0,
      bwToken: query.accessToken,
    }),
  );

export const getCurrentTrip = async (query: CurrentTripArgs) =>
  apiGet(async () =>
    api.routesV1TripCurrentTrip({
      fiskeridirVesselId: query.vessel.fiskeridir.id,
      bwToken: query.accessToken,
    }),
  );
