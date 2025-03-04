import { formatISO } from "date-fns";
import { OrgApi } from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

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

export const getOrgBenchmarks = apiFn((query: OrgBenchmarksArgs, signal) =>
  api.routesV1OrgBenchmarks(
    {
      orgId: query.orgId,
      start: query.start?.toISOString(),
      end: query.end?.toISOString(),
      authorization: query.token!,
    },
    {
      params: { call_sign_override: query.callSignOverride },
      signal,
    },
  ),
);

export const getOrgFuelConsumption = apiFn(
  (query: OrgFuelConsumptionArgs, signal) =>
    api.routesV1OrgFuel(
      {
        orgId: query.orgId,
        start: query.startDate
          ? formatISO(query.startDate, { representation: "date" })
          : undefined,
        end: query.endDate
          ? formatISO(query.endDate, { representation: "date" })
          : undefined,
        authorization: query.token!,
      },
      {
        params: { call_sign_override: query.callSignOverride },
        signal,
      },
    ),
);
