import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { CurrentAisPosition } from "generated/openapi";

export const getAis = createAsyncThunk("ais/getAis", Api.getAis);

export const getCurrentAis = createAsyncThunk(
  "ais/getCurrentAis",
  Api.getCurrentAis,
);

export const setSelectedLivePosition = createAction<
  CurrentAisPosition | undefined
>("ais/setSelectedLivePosition");
