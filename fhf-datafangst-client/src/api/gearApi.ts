import { GearApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

const api = new GearApi(apiConfiguration, undefined, axiosInstance);

export const getGear = async () => apiGet(async () => api.routesV1GearGear());

export const getGearGroups = async () =>
  apiGet(async () => api.routesV1GearGearGroups());

export const getGearMainGroups = async () =>
  apiGet(async () => api.routesV1GearGearMainGroups());
