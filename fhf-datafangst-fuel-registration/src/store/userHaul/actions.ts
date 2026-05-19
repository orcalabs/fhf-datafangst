import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "~/api";

export const getUserHauls = createAsyncThunk(
  "userHaul/getUserHauls",
  Api.getUserHauls,
);

export const getActiveUserHaul = createAsyncThunk(
  "userHaul/getActiveUserHaul",
  Api.getActiveUserHaul,
);

export const startUserHaul = createAsyncThunk(
  "userHaul/startUserHaul",
  Api.startUserHaul,
);

export const stopUserHaul = createAsyncThunk(
  "userHaul/stopUserHaul",
  Api.stopUserHaul,
);

export const abortUserHaul = createAsyncThunk(
  "userHaul/abortUserHaul",
  Api.abortUserHaul,
);

export const deleteUserHaul = createAsyncThunk(
  "userHaul/deleteUserHaul",
  Api.deleteUserHaul,
);
