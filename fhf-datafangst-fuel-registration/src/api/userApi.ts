import {
  UserApi,
  UserApiRoutesV1UserUpdateUserRequest,
} from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface UserArgs {
  fuelConsent?: boolean;
  accessToken?: string;
}

const api = new UserApi(apiConfiguration, undefined, axiosInstance);

export const getUser = apiFn((token: string, signal) =>
  api.routesV1UserGetUser({ authorization: token }, { signal }),
);

const _updateUser = apiFn((args: UserApiRoutesV1UserUpdateUserRequest) =>
  api.routesV1UserUpdateUser(args),
);

export const updateUser = async ({ fuelConsent, accessToken }: UserArgs) => {
  const user = {
    fuelConsent,
  };
  return _updateUser({ updateUser: user, authorization: accessToken! }).then(
    () => user,
  );
};
