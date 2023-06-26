import { V1userApi, Vessel } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from ".";

export interface UserArgs {
  following: Vessel[];
  accessToken?: string;
}

const api = new V1userApi(apiConfiguration, undefined, axiosInstance);

export const getUser = async (token: string) =>
  apiGet(async () => api.getUser({ headers: { "bw-token": token } }));

export const updateUser = async (query: UserArgs) => {
  const user = {
    following: query.following.map((f) => f.fiskeridir.id),
  };
  return apiGet(async () =>
    api.updateUser({ user }, { headers: { "bw-token": query?.accessToken } }),
  ).then(() => user);
};
