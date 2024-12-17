import {
  GearGroup,
  Ordering,
  TripBenchmarkApi,
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

const api = new TripBenchmarkApi(apiConfiguration, undefined, axiosInstance);

export const getTripBenchmarks = async (query: TripBenchmarksArgs) =>
  apiGet(async () =>
    api.routesV1TripBenchmarkTripBenchmarks(
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
    api.routesV1TripBenchmarkAverage({
      startDate: query.startDate.toISOString(),
      endDate: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
    }),
  );

export const getEeoi = async (query: EeoiArgs) =>
  apiGet(async () =>
    api.routesV1TripBenchmarkEeoi(
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
    api.routesV1TripBenchmarkAverageEeoi({
      startDate: query.startDate.toISOString(),
      endDate: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
    }),
  );
