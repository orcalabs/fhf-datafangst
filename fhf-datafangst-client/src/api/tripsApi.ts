import { DateRange } from "components/SearchFilters/DateFilter";
import {
  GearGroupDetailed,
  Ordering,
  SpeciesGroupDetailed,
  TripApi,
  TripSorting,
  Vessel,
} from "generated/openapi";
import { LengthGroup } from "models";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface TripArgs {
  tripId: number;
  accessToken?: string;
}

export interface TripsArgs {
  tripIds?: number[];
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
  cancel?: boolean;
}

export interface CurrentTripArgs {
  vessel: Vessel;
  accessToken?: string;
}

export interface CurrentTripTrackArgs {
  vesselId: number;
  loading: boolean;
  accessToken?: string;
}

const api = new TripApi(apiConfiguration, undefined, axiosInstance);

export const getTrip = apiFn((query: TripArgs, signal) =>
  api.routesV1TripTrips(
    {
      tripIds: [query.tripId],
      bwToken: query.accessToken,
    },
    { signal },
  ),
);

export const getTrips = apiFn((query: TripsArgs, signal) =>
  api.routesV1TripTrips(
    {
      tripIds: query.tripIds,
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
    },
    { signal: query.cancel === false ? undefined : signal },
  ),
);

export const getCurrentTrip = apiFn((query: CurrentTripArgs, signal) =>
  api.routesV1TripCurrentTrip(
    {
      fiskeridirVesselId: query.vessel.fiskeridir.id,
      bwToken: query.accessToken,
    },
    { signal },
  ),
);

export const getCurrentTripTrack = apiFn(
  (query: CurrentTripTrackArgs, signal) =>
    api.routesV1TripCurrentTripPositions(
      {
        fiskeridirVesselId: query.vesselId,
        bwToken: query.accessToken,
      },
      { signal },
    ),
);
