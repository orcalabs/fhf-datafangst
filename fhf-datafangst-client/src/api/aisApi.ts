import { AisApi } from "generated/openapi";
import { Track } from "models";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface AisArgs {
  mmsi: number;
  start?: string;
  end?: string;
}

const api = new AisApi(apiConfiguration, undefined, axiosInstance);

const _getAis = apiFn((query: AisArgs, signal) =>
  api.routesV1AisAisTrack(
    {
      mmsi: query.mmsi,
      start: query.start,
      end: query.end,
    },
    { signal },
  ),
);

export const getAis = async (query: AisArgs) =>
  _getAis(query).then((positions): Track => ({ mmsi: query.mmsi, positions }));
