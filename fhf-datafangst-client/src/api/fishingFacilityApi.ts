import {
  FishingFacilitiesSorting,
  FishingFacilityToolType,
  Ordering,
  V1fishingFacilityApi,
  Vessel,
} from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

export interface FishingFacilitiesArgs {
  accessToken?: string;
  active?: boolean;
  mmsis?: number[];
  vessels?: Vessel[];
  toolTypes?: FishingFacilityToolType[];
  setupRanges?: [Date, Date][];
  removedRanges?: [Date, Date][];
  limit?: number;
  offset?: number;
  ordering?: Ordering;
  sorting?: FishingFacilitiesSorting;
}

const api = new V1fishingFacilityApi(
  apiConfiguration,
  undefined,
  axiosInstance,
);

export const getFishingFacilities = async (query?: FishingFacilitiesArgs) =>
  apiGet(async () =>
    api.fishingFacilities(
      {
        active: query?.active,
        mmsis: query?.mmsis,
        fiskeridirVesselIds: query?.vessels?.map((v) => v.fiskeridir.id),
        toolTypes: query?.toolTypes,
        setupRanges: createRangeString(query?.setupRanges),
        removedRanges: createRangeString(query?.removedRanges),
        limit: query?.limit ?? 10,
        offset: query?.offset ?? 0,
        ordering: query?.ordering ?? Ordering.Desc,
        sorting: query?.sorting ?? FishingFacilitiesSorting.Setup,
      },
      { headers: { "bw-token": query?.accessToken } },
    ),
  );

export const createRangeString = (
  items?: [Date | undefined, Date | undefined][],
) =>
  items?.map(
    ([start, end]) =>
      `[${start ? start.toISOString() : ""},${end ? end.toISOString() : ""}]`,
  );
