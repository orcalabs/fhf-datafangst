import { V1aisVmsApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

export interface TrackArgs {
  accessToken?: string;
  mmsi?: number;
  callSign?: string | null;
  tripId?: number;
  start?: string;
  end?: string;
}

const api = new V1aisVmsApi(apiConfiguration, undefined, axiosInstance);

export const getTrack = async (query: TrackArgs) =>
  apiGet(async () =>
    api.aisVmsPositions(
      {
        mmsi: query.mmsi,
        callSign: query.callSign ?? undefined,
        tripId: query.tripId,
        start: query.start,
        end: query.end,
      },
      { headers: { "bw-token": query?.accessToken } },
    ),
  );
