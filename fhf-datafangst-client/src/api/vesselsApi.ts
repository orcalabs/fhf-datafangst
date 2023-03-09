import { apiConfiguration, apiGet, axiosInstance } from ".";
import { V1vesselApi } from "generated/openapi";

const api = new V1vesselApi(apiConfiguration, undefined, axiosInstance);

export const getVessels = async () => apiGet(async () => api.vessels());
