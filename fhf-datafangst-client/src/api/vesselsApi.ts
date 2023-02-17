import { apiGet, axios } from ".";
import { Vessel } from "models";

export const get = async (vesselId: string) => {
  return axios.get<Vessel>("vessels", {
    params: {
      vessel_id: vesselId,
    },
  });
};

export const getVessels = () => apiGet<Vessel[]>("vessels");
