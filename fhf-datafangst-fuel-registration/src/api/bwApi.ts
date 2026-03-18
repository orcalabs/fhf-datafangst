import { BwUser } from "models";
import { apiFn, axiosBwInternalInstance } from "./baseApi";

export const getBwUser = apiFn((token: string, signal) =>
  axiosBwInternalInstance.get<BwUser>("user/profiles", {
    headers: {
      Authorization: "Bearer " + token,
    },
    signal,
  }),
);
