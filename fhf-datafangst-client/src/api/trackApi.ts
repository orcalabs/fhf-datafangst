import { AisVmsApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface TrackArgs {
  accessToken?: string;
  mmsi?: number;
  callSign?: string | null;
  tripId?: number;
  start?: string;
  end?: string;
}

const api = new AisVmsApi(apiConfiguration, undefined, axiosInstance);

export const getTrack = async (query: TrackArgs) =>
  apiGet(async () =>
    api.routesV1AisVmsAisVmsPositions({
      mmsi: query.mmsi,
      callSign: query.callSign ?? undefined,
      tripId: query.tripId,
      start: query.start,
      end: query.end,
      bwToken: query.accessToken,
    }),
  );
