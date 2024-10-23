import { Ordering, V1tripBenchmarkApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface TripBenchmarksArgs {
  start?: Date;
  end?: Date;
  ordering?: Ordering;
  accessToken?: string;
}

const api = new V1tripBenchmarkApi(apiConfiguration, undefined, axiosInstance);

export const getTripBenchmarks = async (query: TripBenchmarksArgs) =>
  apiGet(async () =>
    api.tripBenchmarks(
      {
        startDate: query?.start?.toISOString(),
        endDate: query?.end?.toISOString(),
        ordering: query.ordering,
      },
      { headers: { "bw-token": query?.accessToken } },
    ),
  );
