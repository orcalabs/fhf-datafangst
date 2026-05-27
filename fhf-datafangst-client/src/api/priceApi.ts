import { PriceApi, type PriceQuery } from "~/generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

const api = new PriceApi(apiConfiguration, undefined, axiosInstance);

export const getPrice = apiFn((query: PriceQuery, signal) =>
  api.routesV1PricePrice(query, { signal }),
);
