import defaultAxios from "axios";
import * as vessels from "./vesselsApi";
import * as species from "./speciesApi";
import * as hauls from "./haulsApi";
import * as gears from "./gearApi";

export const axios = defaultAxios.create({
  baseURL: process.env.REACT_APP_API_URL as string,
});

axios.interceptors.request.use(async (config) => {
  config.headers["Ocp-Apim-Subscription-Key"] = process.env
    .REACT_APP_API_KEY as string;
  return config;
}, Promise.reject);

export const apiGet = async <T>(url: string, params?: any): Promise<T> =>
  axios
    .get<T>(url, { params })
    .then((response) => response.data)
    .catch((e) => {
      console.log("api error", e);
      throw e;
    });

const API = {
  vessels,
  species,
  hauls,
  gears,
};
export default API;
