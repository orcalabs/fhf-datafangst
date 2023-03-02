import { apiGet } from ".";
import { Box } from "utils";
import { GearGroup, Haul, SpeciesGroup, Vessel } from "models";
import { setMonth, setYear } from "date-fns";

export interface HaulsArgs {
  years?: number[];
  months?: number[];
  vessel?: Vessel;
  startDate?: Date;
  endDate?: Date;
  region?: Box;
  speciesGroups?: SpeciesGroup[];
  gearGroups?: GearGroup[];
  vesselLength?: [number, number];
  weight?: [number, number];
  sorting?: string;
  ordering?: string;
  offset?: number;
  limit?: number;
}

const createTimestampsFromYearsMonths = (
  years: number[] | undefined,
  months: number[] | undefined,
) => {
  if (!years?.length) {
    return [];
  }
  if (!months?.length) {
    months = Array.from(new Array(12), (x, i) => i + 1);
  }
  const timestamps: Date[] = [];
  for (const month of months) {
    const date = setMonth(new Date(), month - 1);
    for (const year of years) {
      timestamps.push(setYear(date, year));
    }
  }

  return timestamps;
};

export const getHauls = async (query: HaulsArgs) =>
  apiGet<Haul[]>("hauls", {
    months: query.years
      ? createTimestampsFromYearsMonths(query.years, query.months)
          .map((g) => g.toISOString())
          .toString()
      : undefined,
    vesselId: query.vessel?.id,
    gearGroupIds: query.gearGroups?.map((g) => g.id).toString(),
    specieGroupsIds: query.speciesGroups?.map((g) => g.id).toString(),
    maxWeight: query.weight ? query.weight[1] : undefined,
    minWeight: query.weight ? query.weight[0] : undefined,
    vesselMaxLength: query.vesselLength ? query.vesselLength[1] : undefined,
    vesselMinLength: query.vesselLength ? query.vesselLength[0] : undefined,
    limit: query.limit ?? undefined,
    offset: query.offset ?? undefined,
    startDate: query.startDate?.toISOString(),
    endDate: query.endDate?.toISOString(),
    x1: query.region?.x1,
    y1: query.region?.y1,
    x2: query.region?.x2,
    y2: query.region?.y2,
    ordering: query.ordering ?? undefined,
    sorting: query.sorting ?? undefined,
  });
