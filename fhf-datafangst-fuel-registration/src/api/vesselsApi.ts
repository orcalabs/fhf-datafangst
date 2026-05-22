import { VesselApi } from "~/generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

const api = new VesselApi(apiConfiguration, undefined, axiosInstance);

export const getVessels = apiFn((_: undefined, signal) =>
  api.routesV1VesselVessels({ signal }),
);
