import {
  GearGroup,
  Ordering,
  V1tripBenchmarkApi,
  VesselLengthGroup,
} from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface TripBenchmarksArgs {
  start?: Date;
  end?: Date;
  ordering?: Ordering;
  accessToken?: string;
  callSignOverride?: string | null;
}

export interface EeoiArgs {
  start?: Date;
  end?: Date;
  accessToken?: string;
  callSignOverride?: string | null;
}

export interface AverageTripBenchmarkArgs {
  startDate: Date;
  endDate: Date;
  gearGroups?: GearGroup[];
  lengthGroup?: VesselLengthGroup;
}

export interface AverageEeoiArgs {
  startDate: Date;
  endDate: Date;
  gearGroups?: GearGroup[];
  lengthGroup?: VesselLengthGroup;
}

const api = new V1tripBenchmarkApi(apiConfiguration, undefined, axiosInstance);

export const getTripBenchmarks = async (query: TripBenchmarksArgs) =>
  apiGet(async () =>
    api.tripBenchmarks(
      {
        startDate: query.start?.toISOString(),
        endDate: query.end?.toISOString(),
        ordering: query.ordering,
      },
      {
        headers: { "bw-token": query?.accessToken },
        // Temporary fix for assigning a vessel to user in prod
        params: { call_sign_override: query.callSignOverride },
      },
    ),
  );

export const getAverageTripBenchmarks = async (
  query: AverageTripBenchmarkArgs,
) =>
  apiGet(async () =>
    api.average({
      startDate: query.startDate.toISOString(),
      endDate: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
    }),
  );

export const getEeoi = async (query: EeoiArgs) =>
  apiGet(async () =>
    api.eeoi(
      {
        startDate: query.start?.toISOString(),
        endDate: query.end?.toISOString(),
      },
      {
        headers: { "bw-token": query?.accessToken },
        // Temporary fix for assigning a vessel to user in prod
        params: { call_sign_override: query.callSignOverride },
      },
    ),
  );

export const getAverageEeoi = async (query: AverageEeoiArgs) =>
  apiGet(async () =>
    api.averageEeoi({
      startDate: query.startDate.toISOString(),
      endDate: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
    }),
  );
