import {
  Species,
  SpeciesFao,
  SpeciesFiskeridir,
  SpeciesGroup,
  SpeciesMainGroup,
} from "generated/openapi";

export interface SpecieState {
  species: Record<number, Species>;
  speciesFao: Record<string, SpeciesFao>;
  speciesFiskeridir: Record<number, SpeciesFiskeridir>;
  speciesGroups: Record<number, SpeciesGroup>;
  speciesMainGroups: Record<number, SpeciesMainGroup>;
}

export const initialSpecieState: SpecieState = {
  species: {},
  speciesFao: {},
  speciesFiskeridir: {},
  speciesGroups: {},
  speciesMainGroups: {},
};
