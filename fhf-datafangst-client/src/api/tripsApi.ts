import { apiConfiguration, apiGet, axiosInstance } from ".";
import { Haul, V1tripApi, Ordering, Vessel } from "generated/openapi";

export interface HaulsTripArgs {
  haul: Haul;
}

export interface TripsArgs {
  vessel: Vessel;
  ordering?: Ordering;
  offset?: number;
  limit?: number;
  accessToken?: string;
}

const api = new V1tripApi(apiConfiguration, undefined, axiosInstance);

export const getTripFromHaul = async (query: HaulsTripArgs) =>
  apiGet(async () =>
    api.tripOfHaul({
      haulId: query.haul.haulId,
    }),
  );

export const getTrips = async (query: TripsArgs) =>
  apiGet(async () =>
    api.trips(
      {
        fiskeridirVesselId: query.vessel.fiskeridir.id,
        limit: query.limit ?? 10,
        offset: query.offset ?? 0,
        ordering: query.ordering ?? "desc",
      },
      { headers: { "bw-token": query?.accessToken } },
    ),
  );
