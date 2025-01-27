import { formatISO } from "date-fns";
import { UpdateVessel, VesselApi } from "generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

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

export interface UpdateVesselArgs extends UpdateVessel {
  token?: string;
  callSignOverride?: string | null;
}

const api = new VesselApi(apiConfiguration, undefined, axiosInstance);

export const getVessels = apiFn((_: undefined, signal) =>
  api.routesV1VesselVessels({ signal }),
);

export const getVesselBenchmarks = apiFn((bwToken: string, signal) =>
  api.routesV1VesselBenchmarksBenchmarks({ bwToken }, { signal }),
);

export const getEstimatedFuelConsumption = apiFn((args: FuelArgs, signal) =>
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
    {
      params: { call_sign_override: args.callSignOverride },
      signal,
    },
  ),
);

export const getEstimastedLiveFuelConsumption = apiFn(
  (args: LiveFuelArgs, signal) =>
    api.routesV1VesselLiveFuel(
      {
        threshold: args.threshold,
        bwToken: args.token!,
      },
      {
        params: { call_sign_override: args.callSignOverride },
        signal,
      },
    ),
);

export const updateVessel = apiFn((args: UpdateVesselArgs) =>
  api.routesV1VesselUpdateVessel(
    {
      updateVessel: args,
      bwToken: args.token!,
    },
    {
      params: { call_sign_override: args.callSignOverride },
    },
  ),
);
