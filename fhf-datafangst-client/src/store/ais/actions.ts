import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";
import { AisArgs } from "api";

export const getAis = createAsyncThunk("ais/getAis", Api.getTrack);

export const setAisSearch = createAction<AisArgs>("ais/setAisSearch");
