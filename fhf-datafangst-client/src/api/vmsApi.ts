import { apiConfiguration, apiGet, axiosInstance } from ".";
import { V1vmsApi } from "generated/openapi";

export interface VmsArgs {
  callSign: string;
  start?: string;
  end?: string;
}

const api = new V1vmsApi(apiConfiguration, undefined, axiosInstance);

export const getVms = async (query: VmsArgs) =>
  apiGet(async () =>
    api.vmsPositions({
      callSign: query.callSign,
      start: query.start,
      end: query.end,
    }),
  );
