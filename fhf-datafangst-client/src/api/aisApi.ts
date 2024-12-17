import { AisApi } from "generated/openapi";
import { Track } from "models";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface AisArgs {
  mmsi: number;
  start?: string;
  end?: string;
}

const api = new AisApi(apiConfiguration, undefined, axiosInstance);

export const getAis = async (query: AisArgs) =>
  apiGet(async () =>
    api.routesV1AisAisTrack({
      mmsi: query.mmsi,
      start: query.start,
      end: query.end,
    }),
  ).then((positions): Track => ({ mmsi: query.mmsi, positions }));
