import { FishingFacilityToolType } from "generated/openapi";

export const FishingFacilityToolTypes: Record<
  FishingFacilityToolType | number,
  string
> = {
  1: "Udefinert", // "Undefined",
  2: "Krabbeteine", // "Crabpot",
  3: "Not", // "Danpurseine",
  4: "Garn", // "Nets",
  5: "Line", // "Longline",
  6: "Generisk", // "Generic",
  7: "Sensorbøye", // "Sensorbuoy",
  8: "Sensorkabel", // "Sensorcable",
};
