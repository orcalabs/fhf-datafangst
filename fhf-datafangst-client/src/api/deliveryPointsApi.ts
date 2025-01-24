import { DeliveryPointApi } from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

const api = new DeliveryPointApi(apiConfiguration, undefined, axiosInstance);

export const getDeliveryPoints = apiFn((_: undefined, signal) =>
  api.routesV1DeliveryPointDeliveryPoints({ signal }),
);
