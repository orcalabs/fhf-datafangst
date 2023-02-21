import { Species, SpeciesGroup } from "models";
import { apiGet } from ".";

export const getSpecies = async () => apiGet<Species[]>("species");

export const getSpecieGroups = async () =>
  apiGet<SpeciesGroup[]>("speciesgroup");
