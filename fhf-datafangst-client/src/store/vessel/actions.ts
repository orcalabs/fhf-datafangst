import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { CurrentPosition } from "generated/openapi";
import { authTokenRequired } from "store/actions";

export const getVessels = createAsyncThunk("vessel/getVessels", Api.getVessels);

export const getVesselBenchmarks = createAsyncThunk(
  "vessel/getVesselBenchmarks",
  Api.getVesselBenchmarks,
);

export const getEstimatedFuelConsumption = createAsyncThunk(
  "vessel/getEstimatedFuelConsumption",
  Api.getEstimatedFuelConsumption,
);

export const setSelectedLiveVessel = createAction<CurrentPosition | undefined>(
  "vessel/setSelectedLiveVessel",
);

export const getEstimatedLiveFuelConsumption = createAsyncThunk(
  "vessel/getEstimastedLiveFuelConsumption",
  Api.getEstimastedLiveFuelConsumption,
  { condition: authTokenRequired },
);

export const updateVessel = createAsyncThunk(
  "vessel/updateVessel",
  Api.updateVessel,
);
