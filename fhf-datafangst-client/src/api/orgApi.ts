import { formatISO } from "date-fns";
import { OrgApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface OrgBenchmarksArgs {
  orgId: number;
  start?: Date;
  end?: Date;
  token?: string;
  callSignOverride?: string | null;
}

export interface OrgFuelConsumptionArgs {
  orgId: number;
  startDate?: Date;
  endDate?: Date;
  token?: string;
  callSignOverride?: string | null;
}

const api = new OrgApi(apiConfiguration, undefined, axiosInstance);

export const getOrgBenchmarks = async (query: OrgBenchmarksArgs) =>
  apiGet(async () =>
    api.routesV1OrgBenchmarks(
      {
        orgId: query.orgId,
        start: query.start?.toISOString(),
        end: query.end?.toISOString(),
        bwToken: query.token!,
      },
      {
        params: { call_sign_override: query.callSignOverride },
      },
    ),
  );

export const getOrgFuelConsumption = async (query: OrgFuelConsumptionArgs) =>
  apiGet(async () =>
    api.routesV1OrgFuel(
      {
        orgId: query.orgId,
        startDate: query.startDate
          ? formatISO(query.startDate, { representation: "date" })
          : undefined,
        endDate: query.endDate
          ? formatISO(query.endDate, { representation: "date" })
          : undefined,
        bwToken: query.token!,
      },
      {
        params: { call_sign_override: query.callSignOverride },
      },
    ),
  );