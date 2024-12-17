import { VmsApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface VmsArgs {
  callSign: string;
  start?: string;
  end?: string;
}

const api = new VmsApi(apiConfiguration, undefined, axiosInstance);

export const getVms = async (query: VmsArgs) =>
  apiGet(async () =>
    api.routesV1VmsVmsPositions({
      callSign: query.callSign,
      start: query.start,
      end: query.end,
    }),
  );
