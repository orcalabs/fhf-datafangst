import {
  GearGroup,
  Ordering,
  TripApi,
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

const api = new TripApi(apiConfiguration, undefined, axiosInstance);

export const getTripBenchmarks = async (query: TripBenchmarksArgs) =>
  apiGet(async () =>
    api.routesV1TripBenchmarksBenchmarks(
      {
        startDate: query.start?.toISOString(),
        endDate: query.end?.toISOString(),
        ordering: query.ordering,
        bwToken: query.accessToken!,
      },
      {
        // Temporary fix for assigning a vessel to user in prod
        params: { call_sign_override: query.callSignOverride },
      },
    ),
  );

export const getAverageTripBenchmarks = async (
  query: AverageTripBenchmarkArgs,
) =>
  apiGet(async () =>
    api.routesV1TripBenchmarksAverage({
      startDate: query.startDate.toISOString(),
      endDate: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
    }),
  );

export const getEeoi = async (query: EeoiArgs) =>
  apiGet(async () =>
    api.routesV1TripBenchmarksEeoi(
      {
        startDate: query.start?.toISOString(),
        endDate: query.end?.toISOString(),
        bwToken: query.accessToken!,
      },
      {
        // Temporary fix for assigning a vessel to user in prod
        params: { call_sign_override: query.callSignOverride },
      },
    ),
  );

export const getAverageEeoi = async (query: AverageEeoiArgs) =>
  apiGet(async () =>
    api.routesV1TripBenchmarksAverageEeoi({
      startDate: query.startDate.toISOString(),
      endDate: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
    }),
  );
