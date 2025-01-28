import { subHours } from "date-fns";
import { AisVmsApi } from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface TrackArgs {
  accessToken?: string;
  mmsi?: number;
  callSign?: string | null;
  tripId?: number;
  start?: string;
  end?: string;
}

export interface CurrentPositionsArgs {
  token?: string;
}

const api = new AisVmsApi(apiConfiguration, undefined, axiosInstance);

export const getTrack = apiFn((query: TrackArgs, signal) =>
  api.routesV1AisVmsAisVmsPositions(
    {
      mmsi: query.mmsi,
      callSign: query.callSign ?? undefined,
      tripId: query.tripId,
      start: query.start,
      end: query.end,
      bwToken: query.accessToken,
    },
    { signal },
  ),
);

export const getCurrentPositions = apiFn(
  (query: CurrentPositionsArgs, signal) =>
    api.routesV1AisVmsCurrentPositions(
      {
        positionTimestampLimit: subHours(new Date(), 24).toISOString(),
        bwToken: query.token,
      },
      { signal },
    ),
);
