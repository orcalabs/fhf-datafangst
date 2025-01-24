import { SpeciesApi } from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

const api = new SpeciesApi(apiConfiguration, undefined, axiosInstance);

export const getSpecies = apiFn((_: undefined, signal) =>
  api.routesV1SpeciesSpecies({ signal }),
);

export const getSpeciesFao = apiFn((_: undefined, signal) =>
  api.routesV1SpeciesSpeciesFao({ signal }),
);

export const getSpeciesFiskeridir = apiFn((_: undefined, signal) =>
  api.routesV1SpeciesSpeciesFiskeridir({ signal }),
);

export const getSpeciesMainGroups = apiFn((_: undefined, signal) =>
  api.routesV1SpeciesSpeciesMainGroups({ signal }),
);

export const getSpeciesGroups = apiFn((_: undefined, signal) =>
  api.routesV1SpeciesSpeciesGroups({}, { signal }),
);
