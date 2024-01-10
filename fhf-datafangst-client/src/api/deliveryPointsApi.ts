import { apiConfiguration, apiGet, axiosInstance } from ".";
import { V1deliveryPointApi } from "generated/openapi";

const api = new V1deliveryPointApi(apiConfiguration, undefined, axiosInstance);

export const getDeliveryPoints = async () =>
  apiGet(async () => api.deliveryPoints());
