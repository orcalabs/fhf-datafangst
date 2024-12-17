import { DeliveryPointApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

const api = new DeliveryPointApi(apiConfiguration, undefined, axiosInstance);

export const getDeliveryPoints = async () =>
  apiGet(async () => api.routesV1DeliveryPointDeliveryPoints());
