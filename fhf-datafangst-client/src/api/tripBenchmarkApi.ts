import type {
  GearGroup,
  Ordering,
  SpeciesGroupDetailed,
  VesselLengthGroup,
} from "~/generated/openapi";
import { TripApi } from "~/generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface TripBenchmarksArgs {
  start?: Date;
  end?: Date;
  ordering?: Ordering;
  accessToken?: string;
  callSignOverride?: string | null;
}

export interface EeoiAndFuiArgs {
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

export interface AverageEeoiAndFuiArgs {
  startDate: Date;
  endDate: Date;
  gearGroups?: GearGroup[];
  lengthGroup?: VesselLengthGroup;
  speciesGroupId?: SpeciesGroupDetailed;
  vesselIds?: number[];
}

export interface PerVesselBenchmarkArgs {
  accessToken?: string;
  callSignOverride?: string | null;
  start?: Date;
  end?: Date;
  useFollowingList?: boolean;
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

export const getEeoi = apiFn((query: EeoiAndFuiArgs, signal) =>
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

export const getAverageEeoi = apiFn((query: AverageEeoiAndFuiArgs, signal) =>
  api.routesV1TripBenchmarksAverageEeoi(
    {
      start: query.startDate.toISOString(),
      end: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
      vesselIds: query.vesselIds,
      speciesGroupId: query.speciesGroupId?.id,
    },
    { signal },
  ),
);

export const getSumPerVesselBenchmark = apiFn(
  (query: PerVesselBenchmarkArgs, signal) =>
    api.routesV1TripBenchmarksPerVesselBenchmarksSum(
      {
        authorization: query.accessToken,
        start: query.start?.toISOString(),
        end: query.end?.toISOString(),
        useFollowingList: query.useFollowingList,
      },
      {
        params: { call_sign_override: query.callSignOverride },
        signal,
      },
    ),
);

export const getAvgVesselBenchmark = apiFn(
  (query: PerVesselBenchmarkArgs, signal) =>
    api.routesV1TripBenchmarksPerVesselBenchmarksAvg(
      {
        authorization: query.accessToken,
        start: query.start?.toISOString(),
        end: query.end?.toISOString(),
        useFollowingList: query.useFollowingList,
      },
      {
        params: { call_sign_override: query.callSignOverride },
        signal,
      },
    ),
);

export const getFui = apiFn((query: EeoiAndFuiArgs, signal) =>
  api.routesV1TripBenchmarksFui(
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

export const getAverageFui = apiFn((query: AverageEeoiAndFuiArgs, signal) =>
  api.routesV1TripBenchmarksAverageFui(
    {
      start: query.startDate.toISOString(),
      end: query.endDate.toISOString(),
      gearGroups: query.gearGroups,
      lengthGroup: query.lengthGroup,
      vesselIds: query.vesselIds,
      speciesGroupId: query.speciesGroupId?.id,
    },
    { signal },
  ),
);
