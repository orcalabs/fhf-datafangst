import type { PerTripStats } from "~/generated/openapi";

type KpiKey = Exclude<
  keyof PerTripStats,
  "tripId" | "startTimestamp" | "endTimestamp"
>;

export const TripKpi = {
  LivingWeight: "livingWeight",
  WeightPerHour: "weightPerHour",
  WeightPerDistance: "weightPerDistance",
  FuelConsumptionLiter: "fuelConsumptionLiter",
  WeightPerFuelLiter: "weightPerFuelLiter",
  CatchValuePerFuelLiter: "catchValuePerFuelLiter",
  NumHauls: "numHauls",
  ValueNok: "valueNok",
  TripDurationSeconds: "tripDurationSeconds",
} as const satisfies Record<string, KpiKey>;

export type TripKpiKey = (typeof TripKpi)[keyof typeof TripKpi];
