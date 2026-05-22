import { UserHaulApi, type HaulEnd, type HaulStart } from "~/generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface GetUserHaulArgs {
  token?: string;
  callSignOverride?: string | null;
}

export interface StartUserHaulArgs extends HaulStart {
  token?: string;
  callSignOverride?: string | null;
}

export interface StopUserHaulArgs extends HaulEnd {
  token?: string;
  callSignOverride?: string | null;
}

export interface AbortUserHaulArgs {
  token?: string;
  callSignOverride?: string | null;
}

export interface DeleteUserHaulArgs {
  userHaulId: number;
  token?: string;
  callSignOverride?: string | null;
}

const api = new UserHaulApi(apiConfiguration, undefined, axiosInstance);

export const getUserHauls = apiFn(
  ({ token, callSignOverride }: GetUserHaulArgs) =>
    api.routesV1UserHaulUserHauls(
      {
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);

export const getActiveUserHaul = apiFn(
  ({ token, callSignOverride }: GetUserHaulArgs) =>
    api.routesV1UserHaulCurrentUserHaul(
      {
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);

export const startUserHaul = apiFn(
  ({ token, callSignOverride, ...haulStart }: StartUserHaulArgs) =>
    api.routesV1UserHaulStartUserHaul(
      {
        haulStart,
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);

export const stopUserHaul = apiFn(
  ({ token, callSignOverride, ...haulEnd }: StopUserHaulArgs) =>
    api.routesV1UserHaulStopUserHaul(
      {
        haulEnd,
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);

export const abortUserHaul = apiFn(
  ({ token, callSignOverride }: AbortUserHaulArgs) =>
    api.routesV1UserHaulAbortUserHaul(
      {
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);

export const deleteUserHaul = apiFn(
  ({ userHaulId, token, callSignOverride }: DeleteUserHaulArgs) =>
    api.routesV1UserHaulDeleteUserHaul(
      {
        userHaulId,
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);
