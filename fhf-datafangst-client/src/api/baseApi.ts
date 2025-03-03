import defaultAxios, { AxiosResponse } from "axios";
import { Configuration } from "generated/openapi";

export const apiConfiguration = new Configuration({
  basePath: process.env.REACT_APP_API_URL,
});

export const axiosInstance = defaultAxios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const axiosBwInstance = defaultAxios.create({
  baseURL: process.env.REACT_APP_BW_API_URL,
});

export const axiosBwInternalInstance = defaultAxios.create({
  baseURL: process.env.REACT_APP_BW_INTERNAL_API_URL,
});

axiosInstance.interceptors.request.use(function addBearer(v) {
  const auth = v.headers.getAuthorization();
  if (auth) {
    v.headers.setAuthorization(`Bearer ${auth}`);
  }
  return v;
});

type AxiosFnReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<AxiosResponse<infer R, any>>
  ? R
  : unknown;

export function apiFn<
  F extends (
    args: Parameters<F>[0],
    signal: AbortSignal,
  ) => Promise<AxiosResponse<AxiosFnReturnType<F>, any>>,
>(fn: F): (args: Parameters<F>[0]) => Promise<AxiosFnReturnType<F>> {
  let controller: AbortController | undefined;

  return async (args) => {
    controller?.abort();

    controller = new AbortController();

    return fn(args, controller.signal)
      .then((response) => response.data)
      .catch((e) => {
        // Ignore errors caused by cancellation
        if (e.code !== "ERR_CANCELED") {
          console.log("api error", e);
        }
        throw e;
      });
  };
}
