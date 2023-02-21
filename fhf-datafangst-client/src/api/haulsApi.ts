import { apiGet } from ".";
import { Box } from "utils";
import { GearGroup, Haul, SpeciesGroup, Vessel } from "models";

export interface HaulsArgs {
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

export const getHauls = async (query: HaulsArgs) =>
  apiGet<Haul[]>("hauls", {
    vesselId: query.vessel?.id,
    gearGroupIds: query.gearGroups?.map((g) => g.id).toString(),
    specieGroupsIds: query.speciesGroups?.map((g) => g.id).toString(),
    maxWeight: query.weight ? query.weight[1] : undefined,
    minWeight: query.weight ? query.weight[0] : undefined,
    vesselMaxLength: query.vesselLength ? query.vesselLength[1] : undefined,
    vesselMinLength: query.vesselLength ? query.vesselLength[0] : undefined,
    limit: query.limit ?? 10,
    offset: query.offset ?? 0,
    startDate: query.startDate?.toISOString(),
    endDate: query.endDate?.toISOString(),
    x1: query.region?.x1,
    y1: query.region?.y1,
    x2: query.region?.x2,
    y2: query.region?.y2,
    ordering: query.ordering ? query.ordering : "desc",
    sorting: query.sorting ? query.sorting : "date",
  });
