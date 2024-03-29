import { apiGet, axiosBwInstance } from "api";
import { FiskInfoProfile } from "models";

export const getBwProfile = async (token: string) =>
  apiGet(async () =>
    axiosBwInstance.get<FiskInfoProfile>("geodata/fishingfacilityprofile", {
      headers: {
        Authorization: "Bearer " + token,
      },
    }),
  );
