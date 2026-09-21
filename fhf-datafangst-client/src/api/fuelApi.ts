import type { CreateFuelMeasurement } from "~/generated/openapi";
import { FuelMeasurementApi } from "~/generated/openapi";
import { apiConfiguration, apiFn, axiosInstance } from "./baseApi";

export interface FuelMeasurementsArgs {
  token?: string;
  startDate?: Date;
  endDate?: Date;
  callSignOverride?: string | null;
}

export interface CreateFuelMeasurementsArgs extends CreateFuelMeasurement {
  callSignOverride?: string | null;
  token?: string;
}

export interface UpdateFuelMeasurementsArgs extends CreateFuelMeasurement {
  fuelMeasurementId: number;
  callSignOverride?: string | null;
  token?: string;
}

export interface DeleteFuelMeasurementsArgs {
  fuelMeasurementId: number;
  callSignOverride?: string | null;
  token?: string;
}

const api = new FuelMeasurementApi(apiConfiguration, undefined, axiosInstance);

export const getFuelMeasurements = apiFn((args: FuelMeasurementsArgs, signal) =>
  api.routesV1FuelMeasurementGetFuelMeasurements(
    {
      start: args.startDate?.toISOString(),
      end: args.endDate?.toISOString(),
      authorization: args.token!,
    },
    { params: { call_sign_override: args.callSignOverride }, signal },
  ),
);

export const createFuelMeasurement = apiFn(
  ({ token, ...body }: CreateFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementCreateFuelMeasurement(
      {
        createFuelMeasurement: body,
        authorization: token!,
      },
      {
        params: { call_sign_override: body.callSignOverride },
      },
    ),
);

export const updateFuelMeasurement = apiFn(
  ({
    token,
    callSignOverride,
    fuelMeasurementId,
    ...createFuelMeasurement
  }: UpdateFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementUpdateFuelMeasurement(
      {
        fuelMeasurementId,
        createFuelMeasurement,
        authorization: token!,
      },
      {
        params: { call_sign_override: callSignOverride },
      },
    ),
);

export const deleteFuelMeasurement = apiFn(
  ({
    fuelMeasurementId,
    token,
    callSignOverride,
  }: DeleteFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementDeleteFuelMeasurement(
      {
        fuelMeasurementId,
        authorization: token!,
      },
      {
        params: { call_sign_override: callSignOverride },
      },
    ),
);

export const getFuelMeasurementsAndBunkerings = apiFn(
  (args: FuelMeasurementsArgs, signal) =>
    api.routesV1FuelMeasurementGetFuelMeasurementsAndBunkerings(
      {
        start: args.startDate?.toISOString(),
        end: args.endDate?.toISOString(),
        authorization: args.token!,
      },
      { params: { call_sign_override: args.callSignOverride }, signal },
    ),
);
