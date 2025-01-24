import { GearApi } from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

const api = new GearApi(apiConfiguration, undefined, axiosInstance);

export const getGear = apiFn((_: undefined, signal) =>
  api.routesV1GearGear({ signal }),
);

export const getGearGroups = apiFn((_: undefined, signal) =>
  api.routesV1GearGearGroups({ signal }),
);

export const getGearMainGroups = apiFn((_: undefined, signal) =>
  api.routesV1GearGearMainGroups({ signal }),
);
