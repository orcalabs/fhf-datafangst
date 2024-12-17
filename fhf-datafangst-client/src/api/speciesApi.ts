import { SpeciesApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

const api = new SpeciesApi(apiConfiguration, undefined, axiosInstance);

export const getSpecies = async () =>
  apiGet(async () => api.routesV1SpeciesSpecies());

export const getSpeciesFao = async () =>
  apiGet(async () => api.routesV1SpeciesSpeciesFao());

export const getSpeciesFiskeridir = async () =>
  apiGet(async () => api.routesV1SpeciesSpeciesFiskeridir());

export const getSpeciesMainGroups = async () =>
  apiGet(async () => api.routesV1SpeciesSpeciesMainGroups());

export const getSpeciesGroups = async () =>
  apiGet(async () => api.routesV1SpeciesSpeciesGroups());
