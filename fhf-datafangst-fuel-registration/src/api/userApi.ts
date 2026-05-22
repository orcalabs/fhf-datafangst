import type {
  UpdateUser,
  UserApiRoutesV1UserUpdateUserRequest,
  Vessel,
} from "~/generated/openapi";
import { UserApi } from "~/generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface UserArgs extends Omit<UpdateUser, "following"> {
  following?: Vessel[];
  accessToken?: string;
}

const api = new UserApi(apiConfiguration, undefined, axiosInstance);

export const getUser = apiFn((token: string, signal) =>
  api.routesV1UserGetUser({ authorization: token }, { signal }),
);

const _updateUser = apiFn((args: UserApiRoutesV1UserUpdateUserRequest) =>
  api.routesV1UserUpdateUser(args),
);

export const updateUser = async ({
  following,
  accessToken,
  ...query
}: UserArgs) => {
  const user = {
    ...query,
    following: following?.map((f) => f.fiskeridir.id),
  };
  return _updateUser({ updateUser: user, authorization: accessToken! }).then(
    () => user,
  );
};
