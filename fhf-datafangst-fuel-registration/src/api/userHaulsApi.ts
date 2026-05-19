import { UserHaulApi, type HaulEnd, type HaulStart } from "~/generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface StartUserHaulArgs extends HaulStart {
  token?: string;
}

export interface StopUserHaulArgs extends HaulEnd {
  token?: string;
}

export interface DeleteUserHaulArgs {
  userHaulId: number;
  token?: string;
}

const api = new UserHaulApi(apiConfiguration, undefined, axiosInstance);

export const getUserHauls = apiFn(({ token }: { token?: string }) =>
  api.routesV1UserHaulUserHauls({
    authorization: token,
  }),
);

export const getActiveUserHaul = apiFn(({ token }: { token?: string }) =>
  api.routesV1UserHaulCurrentUserHaul({
    authorization: token,
  }),
);

export const startUserHaul = apiFn(
  ({ token, ...haulStart }: StartUserHaulArgs) =>
    api.routesV1UserHaulStartUserHaul({
      haulStart,
      authorization: token,
    }),
);

export const stopUserHaul = apiFn(({ token, ...haulEnd }: StopUserHaulArgs) =>
  api.routesV1UserHaulStopUserHaul({
    haulEnd,
    authorization: token,
  }),
);

export const abortUserHaul = apiFn(({ token }: { token?: string }) =>
  api.routesV1UserHaulAbortUserHaul({
    authorization: token,
  }),
);

export const deleteUserHaul = apiFn(
  ({ userHaulId, token }: DeleteUserHaulArgs) =>
    api.routesV1UserHaulDeleteUserHaul({
      userHaulId,
      authorization: token,
    }),
);
