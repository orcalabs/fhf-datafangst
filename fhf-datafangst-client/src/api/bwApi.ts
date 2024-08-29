import { FiskInfoProfile } from "models";
import { apiGet, axiosBwInstance } from "./baseApi";

export const getBwProfile = async (token: string) =>
  apiGet(async () =>
    axiosBwInstance.get<FiskInfoProfile>("geodata/fishingfacilityprofile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    }),
  );
