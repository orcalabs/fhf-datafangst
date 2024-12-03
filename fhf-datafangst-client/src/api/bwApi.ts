import { BwUser } from "models";
import { apiGet, axiosBwInternalInstance } from "./baseApi";

export const getBwUser = async (token: string) =>
  apiGet(async () =>
    axiosBwInternalInstance.get<BwUser>("user/profiles", {
      headers: {
        Authorization: "Bearer " + token,
      },
    }),
  );
