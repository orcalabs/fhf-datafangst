import { apiConfiguration, apiGet, axiosInstance } from ".";
import { V1aisVmsApi } from "generated/openapi";

export interface TrackArgs {
  accessToken?: string;
  mmsi?: number;
  callSign?: string | null;
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
        start: query.start,
        end: query.end,
      },
      { headers: { "bw-token": query?.accessToken } },
    ),
  );
