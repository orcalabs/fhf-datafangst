import { VesselApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

const api = new VesselApi(apiConfiguration, undefined, axiosInstance);

export const getVessels = async () =>
  apiGet(async () => api.routesV1VesselVessels());

export const getVesselBenchmarks = async (bwToken: string) =>
  apiGet(async () => api.routesV1VesselVesselBenchmarks({ bwToken }));
