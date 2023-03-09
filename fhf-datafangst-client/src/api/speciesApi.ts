import { V1speciesApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

const api = new V1speciesApi(apiConfiguration, undefined, axiosInstance);

export const getSpecies = async () => apiGet(async () => api.species());

export const getSpeciesFao = async () => apiGet(async () => api.speciesFao());

export const getSpeciesFiskeridir = async () =>
  apiGet(async () => api.speciesFiskeridir());

export const getSpeciesMainGroups = async () =>
  apiGet(async () => api.speciesMainGroups());

export const getSpeciesGroups = async () =>
  apiGet(async () => api.speciesGroups());
