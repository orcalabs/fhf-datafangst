import { Species, SpeciesGroup } from "models";

export interface SpecieState {
  specieGroups: SpeciesGroup[];
  species: Species[];
}

export const initialSpecieState: SpecieState = {
  species: [],
  specieGroups: [],
};
