import {
  Species,
  SpeciesFao,
  SpeciesFiskeridir,
  SpeciesGroup,
  SpeciesMainGroup,
} from "models";

export interface SpecieState {
  species: Species[];
  speciesFao: SpeciesFao[];
  speciesFiskeridir: SpeciesFiskeridir[];
  speciesGroups: SpeciesGroup[];
  speciesMainGroups: SpeciesMainGroup[];
}

export const initialSpecieState: SpecieState = {
  species: [],
  speciesFao: [],
  speciesFiskeridir: [],
  speciesGroups: [],
  speciesMainGroups: [],
};
