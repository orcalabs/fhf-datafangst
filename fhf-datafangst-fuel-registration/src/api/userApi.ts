import { UserApi } from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

const api = new UserApi(apiConfiguration, undefined, axiosInstance);

export const getUser = apiFn((token: string, signal) =>
  api.routesV1UserGetUser({ authorization: token }, { signal }),
);
