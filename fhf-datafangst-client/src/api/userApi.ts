import { UserApi, Vessel } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface UserArgs {
  following: Vessel[];
  accessToken?: string;
}

const api = new UserApi(apiConfiguration, undefined, axiosInstance);

export const getUser = async (token: string) =>
  apiGet(async () => api.routesV1UserGetUser({ bwToken: token }));

export const updateUser = async (query: UserArgs) => {
  const user = {
    following: query.following.map((f) => f.fiskeridir.id),
  };
  return apiGet(async () =>
    api.routesV1UserUpdateUser({ user, bwToken: query.accessToken! }),
  ).then(() => user);
};
