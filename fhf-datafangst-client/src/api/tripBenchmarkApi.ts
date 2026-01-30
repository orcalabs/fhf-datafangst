import {
  GearGroup,
  Ordering,
  TripApi,
  VesselLengthGroup,
} from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

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

export const getTripBenchmarks = apiFn((query: TripBenchmarksArgs, signal) =>
  api.routesV1TripBenchmarksBenchmarks(
    {
      start: query.start?.toISOString(),
      end: query.end?.toISOString(),
      ordering: query.ordering,
      authorization: query.accessToken!,
    },
    {
      // Temporary fix for assigning a vessel to user in prod
      params: { call_sign_override: query.callSignOverride },
      signal,
    },
  ),
);

export const getAverageTripBenchmarks = apiFn(
  (query: AverageTripBenchmarkArgs, signal) =>
    api.routesV1TripBenchmarksAverage(
      {
        start: query.startDate.toISOString(),
        end: query.endDate.toISOString(),
        gearGroups: query.gearGroups,
        lengthGroup: query.lengthGroup,
      },
      { signal },
    ),
);

export const getEeoi = apiFn((query: EeoiArgs, signal) =>
  api.routesV1TripBenchmarksEeoi(
    {
      start: query.start?.toISOString(),
      end: query.end?.toISOString(),
      authorization: query.accessToken!,
    },
    {
      // Temporary fix for assigning a vessel to user in prod
      params: { call_sign_override: query.callSignOverride },
      signal,
    },
  ),
);

export const getAverageEeoi = apiFn((query: AverageEeoiArgs, signal) =>
  api.routesV1TripBenchmarksAverageEeoi(
    {
      start: query.startDate.toISOString(),
      end: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
    },
    { signal },
  ),
);
