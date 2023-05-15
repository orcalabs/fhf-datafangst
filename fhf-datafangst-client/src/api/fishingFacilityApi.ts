import {
  FishingFacilityToolType,
  V1fishingFacilityApi,
} from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

export interface FishingFacilitiesArgs {
  active?: boolean;
  mmsis?: number[];
  callSigns?: string[];
  toolTypes?: FishingFacilityToolType[];
  setupRanges?: [Date, Date][];
  removedRanges?: [Date, Date][];
}

const _FishingFacilityToolType = {
  [FishingFacilityToolType.Undefined]: 1,
  [FishingFacilityToolType.Crabpot]: 2,
  [FishingFacilityToolType.Danpurseine]: 3,
  [FishingFacilityToolType.Nets]: 4,
  [FishingFacilityToolType.Longline]: 5,
  [FishingFacilityToolType.Generic]: 6,
  [FishingFacilityToolType.Sensorbuoy]: 7,
  [FishingFacilityToolType.Sensorcable]: 8,
};

const api = new V1fishingFacilityApi(
  apiConfiguration,
  undefined,
  axiosInstance,
);

export const getFishingFacilities = async (query?: FishingFacilitiesArgs) =>
  apiGet(async () =>
    api.fishingFacilities({
      active: query?.active,
      mmsis: query?.mmsis?.join(","),
      callSigns: query?.callSigns?.join(","),
      toolTypes: query?.toolTypes
        ?.map((t) => _FishingFacilityToolType[t])
        .join(","),
      setupRanges: createRangeString(query?.setupRanges),
      removedRanges: createRangeString(query?.removedRanges),
    }),
  );

export const createRangeString = (
  items?: [Date | undefined, Date | undefined][],
) => {
  if (!items?.length) {
    return undefined;
  }

  return items
    .map(
      ([start, end]) =>
        `[${start ? start.toISOString() : ""},${end ? end.toISOString() : ""}]`,
    )
    .join(";");
};
