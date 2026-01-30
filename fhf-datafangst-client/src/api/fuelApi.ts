import {
  CreateFuelMeasurement,
  DeleteFuelMeasurement,
  FuelMeasurement,
  FuelMeasurementApi,
  UploadFuelMeasurement,
} from "generated/openapi";
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

export interface UploadFuelMeasurementsArgs extends UploadFuelMeasurement {
  callSignOverride?: string | null;
  token?: string;
}

export interface UpdateFuelMeasurementsArgs extends FuelMeasurement {
  callSignOverride?: string | null;
  token?: string;
}

export interface DeleteFuelMeasurementsArgs extends DeleteFuelMeasurement {
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
    api.routesV1FuelMeasurementCreateFuelMeasurements(
      {
        createFuelMeasurement: [body],
        authorization: token!,
      },
      {
        params: { call_sign_override: body.callSignOverride },
      },
    ),
);

export const uploadFuelMeasurements = apiFn(
  ({ token, ...body }: UploadFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementUploadFuelMeasurements(
      {
        uploadFuelMeasurement: body,
        authorization: token!,
      },
      {
        params: { call_sign_override: body.callSignOverride },
      },
    ),
);

export const updateFuelMeasurement = apiFn(
  ({ token, ...body }: UpdateFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementUpdateFuelMeasurements(
      {
        fuelMeasurement: [body],
        authorization: token!,
      },
      {
        params: { call_sign_override: body.callSignOverride },
      },
    ),
);

export const deleteFuelMeasurement = apiFn(
  ({ token, ...body }: DeleteFuelMeasurementsArgs) =>
    api.routesV1FuelMeasurementDeleteFuelMeasurements(
      {
        deleteFuelMeasurement: [body],
        authorization: token!,
      },
      {
        params: { call_sign_override: body.callSignOverride },
      },
    ),
);
