import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { Vessel } from "generated/openapi";

export const getUser = createAsyncThunk("user/getUser", Api.getUser);

export const updateUser = createAsyncThunk("user/updateUser", Api.updateUser);
export const setSelectedVessels = createAction<Vessel[]>(
  "user/setSelectedVessels",
);
