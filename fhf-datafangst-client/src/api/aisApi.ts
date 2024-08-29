import { V1aisApi } from "generated/openapi";
import { Track } from "models";
import { apiConfiguration, apiGet, axiosInstance } from ".";

export interface AisArgs {
  mmsi: number;
  start?: string;
  end?: string;
}

const api = new V1aisApi(apiConfiguration, undefined, axiosInstance);

export const getAis = async (query: AisArgs) =>
  apiGet(async () =>
    api.aisTrack({
      mmsi: query.mmsi,
      start: query.start,
      end: query.end,
    }),
  ).then((positions): Track => ({ mmsi: query.mmsi, positions }));
