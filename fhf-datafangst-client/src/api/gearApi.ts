import { V1gearApi } from "generated/openapi";
import { apiConfiguration, apiGet } from ".";

const api = new V1gearApi(apiConfiguration);

export const getGear = async () => apiGet(async () => api.gear());

export const getGearGroups = async () => apiGet(async () => api.gearGroups());

export const getGearMainGroups = async () =>
  apiGet(async () => api.gearMainGroups());
