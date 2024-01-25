import { apiConfiguration, apiGet, axiosInstance } from ".";
import { V1aisVmsApi } from "generated/openapi";
import { BoundingBox } from "utils";
import { formatISO } from "date-fns";

export interface AisAreaArgs {
  box: BoundingBox;
  dateLimit?: Date;
}

const api = new V1aisVmsApi(apiConfiguration, undefined, axiosInstance);

export const getAisVmsArea = async (query: AisAreaArgs) =>
  apiGet(async () =>
    api.aisVmsArea({
      x1: query.box.x1,
      x2: query.box.x2,
      y1: query.box.y1,
      y2: query.box.y2,
      dateLimit: query.dateLimit
        ? formatISO(new Date(query.dateLimit), { representation: "date" })
        : undefined,
    }),
  );
