import {
  Species,
  SpeciesFao,
  SpeciesFiskeridir,
  SpeciesGroupDetailed,
  SpeciesMainGroupDetailed,
} from "generated/openapi";

export interface SpeciesState {
  species?: Species[];
  speciesFao?: SpeciesFao[];
  speciesFiskeridir?: SpeciesFiskeridir[];
  speciesGroups?: SpeciesGroupDetailed[];
  speciesMainGroups?: SpeciesMainGroupDetailed[];
}

export const initialSpeciesState: SpeciesState = {
  species: undefined,
  speciesFao: undefined,
  speciesFiskeridir: undefined,
  speciesGroups: undefined,
  speciesMainGroups: undefined,
};
