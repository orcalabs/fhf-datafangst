import { formatISO } from "date-fns";
import { VesselApi } from "generated/openapi";
import { apiConfiguration, apiGet, axiosInstance } from "./baseApi";

export interface FuelArgs {
  token?: string;
  startDate?: Date;
  endDate?: Date;
  callSignOverride?: string | null;
}

export interface LiveFuelArgs {
  token?: string;
  threshold?: string;
  callSignOverride?: string | null;
}

const api = new VesselApi(apiConfiguration, undefined, axiosInstance);

export const getVessels = async () =>
  apiGet(async () => api.routesV1VesselVessels());

export const getVesselBenchmarks = async (bwToken: string) =>
  apiGet(async () => api.routesV1VesselBenchmarksBenchmarks({ bwToken }));

export const getEstimatedFuelConsumption = async (args: FuelArgs) =>
  apiGet(async () =>
    api.routesV1VesselFuel(
      {
        startDate: args.startDate
          ? formatISO(args.startDate, { representation: "date" })
          : undefined,
        endDate: args.endDate
          ? formatISO(args.endDate, { representation: "date" })
          : undefined,
        bwToken: args.token!,
      },
      { params: { call_sign_override: args.callSignOverride } },
    ),
  );

export const getEstimastedLiveFuelConsumption = async (args: LiveFuelArgs) =>
  apiGet(async () =>
    api.routesV1VesselLiveFuel(
      {
        threshold: args.threshold,
        bwToken: args.token!,
      },
      { params: { call_sign_override: args.callSignOverride } },
    ),
  );
