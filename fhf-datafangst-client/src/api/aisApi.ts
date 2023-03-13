import { apiConfiguration, apiGet, axiosInstance } from ".";
import { Track } from "models";
import { V1aisApi } from "generated/openapi";

export interface AisArgs {
  mmsi: number;
  start?: Date;
  end?: Date;
}

const api = new V1aisApi(apiConfiguration, undefined, axiosInstance);

export const getTrack = async (query: AisArgs) =>
  apiGet(async () =>
    api.aisTrack({
      mmsi: query.mmsi,
      start: query.start?.toISOString(),
      end: query.end?.toISOString(),
    }),
  ).then((positions): Track => ({ mmsi: query.mmsi, positions }));
