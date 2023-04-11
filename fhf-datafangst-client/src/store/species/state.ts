import {
  Species,
  SpeciesFao,
  SpeciesFiskeridir,
  SpeciesGroup,
  SpeciesMainGroup,
} from "generated/openapi";

export interface SpeciesState {
  species: Record<number, Species>;
  speciesFao: Record<string, SpeciesFao>;
  speciesFiskeridir: Record<number, SpeciesFiskeridir>;
  speciesGroups: Record<number, SpeciesGroup>;
  speciesMainGroups: Record<number, SpeciesMainGroup>;
}

export const initialSpeciesState: SpeciesState = {
  species: {},
  speciesFao: {},
  speciesFiskeridir: {},
  speciesGroups: {},
  speciesMainGroups: {},
};
