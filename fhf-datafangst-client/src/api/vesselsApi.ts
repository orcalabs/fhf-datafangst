import { apiConfiguration, apiGet } from ".";
import { V1vesselApi } from "generated/openapi";

const api = new V1vesselApi(apiConfiguration);

export const getVessels = async () => apiGet(async () => api.vessels());
