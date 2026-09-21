import { BunkeringApi, type CreateBunkering } from "~/generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface CreateBunkeringArgs extends CreateBunkering {
  token?: string;
  callSignOverride?: string | null;
}

export interface UpdateBunkeringArgs extends CreateBunkering {
  bunkeringId: number;
  token?: string;
  callSignOverride?: string | null;
}

export interface DeleteBunkeringArgs {
  bunkeringId: number;
  token?: string;
  callSignOverride?: string | null;
}

const api = new BunkeringApi(apiConfiguration, undefined, axiosInstance);

export const createBunkering = apiFn(
  ({ token, callSignOverride, ...createBunkering }: CreateBunkeringArgs) =>
    api.routesV1BunkeringCreateBunkering(
      {
        createBunkering,
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);

export const updateBunkering = apiFn(
  ({
    bunkeringId,
    token,
    callSignOverride,
    ...createBunkering
  }: UpdateBunkeringArgs) =>
    api.routesV1BunkeringUpdateBunkering(
      {
        bunkeringId,
        createBunkering,
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);

export const deleteBunkering = apiFn(
  ({ bunkeringId, token, callSignOverride }: DeleteBunkeringArgs) =>
    api.routesV1BunkeringDeleteBunkering(
      {
        bunkeringId,
        authorization: token,
      },
      { params: { call_sign_override: callSignOverride } },
    ),
);
