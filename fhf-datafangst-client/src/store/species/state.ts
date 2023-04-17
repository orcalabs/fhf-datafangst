import {
  Species,
  SpeciesFao,
  SpeciesFiskeridir,
  SpeciesGroup,
  SpeciesMainGroup,
} from "generated/openapi";

export interface SpeciesState {
  species?: Species[];
  speciesFao?: SpeciesFao[];
  speciesFiskeridir?: SpeciesFiskeridir[];
  speciesGroups?: SpeciesGroup[];
  speciesMainGroups?: SpeciesMainGroup[];
}

export const initialSpeciesState: SpeciesState = {
  species: undefined,
  speciesFao: undefined,
  speciesFiskeridir: undefined,
  speciesGroups: undefined,
  speciesMainGroups: undefined,
};
