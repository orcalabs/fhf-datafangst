import { apiConfiguration, apiGet, axiosInstance } from ".";
import { Haul, V1tripApi } from "generated/openapi";

export interface TripsArgs {
  haul: Haul;
}
const api = new V1tripApi(apiConfiguration, undefined, axiosInstance);

export const getTripFromHaul = async (query: TripsArgs) =>
  apiGet(async () =>
    api.tripOfHaul({
      haulId: query.haul?.haulId,
    }),
  );
