import defaultAxios, { AxiosResponse } from "axios";
import { Configuration } from "generated/openapi";

export const apiConfiguration = new Configuration({
  basePath: process.env.REACT_APP_API_URL,
});

export const axiosInstance = defaultAxios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers["Ocp-Apim-Subscription-Key"] = process.env.REACT_APP_API_KEY;
  return config;
}, Promise.reject);

export const apiGet = async <T>(
  fn: () => Promise<AxiosResponse<T, any>>,
): Promise<T> =>
  fn()
    .then((response) => response.data)
    .catch((e) => {
      console.log("api error", e);
      throw e;
    });
