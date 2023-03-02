import {
  Species,
  SpeciesFao,
  SpeciesFiskeridir,
  SpeciesGroup,
  SpeciesMainGroup,
} from "models";
import { apiGet } from ".";

export const getSpecies = async () => apiGet<Species[]>("species");

export const getSpeciesFao = async () => apiGet<SpeciesFao[]>("species_fao");

export const getSpeciesFiskeridir = async () =>
  apiGet<SpeciesFiskeridir[]>("species_fiskeridir");

export const getSpeciesMainGroups = async () =>
  apiGet<SpeciesMainGroup[]>("species_main_groups");

export const getSpeciesGroups = async () =>
  apiGet<SpeciesGroup[]>("species_groups");
