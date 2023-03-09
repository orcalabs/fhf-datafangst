import { V1gearApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

const api = new V1gearApi(apiConfiguration, undefined, axiosInstance);

export const getGear = async () => apiGet(async () => api.gear());

export const getGearGroups = async () => apiGet(async () => api.gearGroups());

export const getGearMainGroups = async () =>
  apiGet(async () => api.gearMainGroups());
