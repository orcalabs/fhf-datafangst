import {
  UserApi,
  UserApiRoutesV1UserUpdateUserRequest,
  Vessel,
} from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface UserArgs {
  following: Vessel[];
  accessToken?: string;
}

const api = new UserApi(apiConfiguration, undefined, axiosInstance);

export const getUser = apiFn((token: string, signal) =>
  api.routesV1UserGetUser({ bwToken: token }, { signal }),
);

const _updateUser = apiFn((args: UserApiRoutesV1UserUpdateUserRequest) =>
  api.routesV1UserUpdateUser(args),
);

export const updateUser = async (query: UserArgs) => {
  const user = { following: query.following.map((f) => f.fiskeridir.id) };
  return _updateUser({ user, bwToken: query.accessToken! }).then(() => user);
};
