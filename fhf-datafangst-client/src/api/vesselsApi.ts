import { V1vesselApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

const api = new V1vesselApi(apiConfiguration, undefined, axiosInstance);

export const getVessels = async () => apiGet(async () => api.vessels());

export const getVesselBenchmarks = async () =>
  apiGet(async () => api.vesselBenchmarks());
