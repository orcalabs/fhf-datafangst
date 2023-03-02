import { LengthGroup } from "models";
import { GearGroup, SpeciesGroup, Vessel } from "generated/openapi";
import { Box } from "utils";

export interface HaulsFilter {
  vessel?: Vessel;
  region?: Box;
  speciesGroups?: SpeciesGroup[];
  gearGroups?: GearGroup[];
  weight?: [number, number];
  lengthGroups?: LengthGroup[];
}
