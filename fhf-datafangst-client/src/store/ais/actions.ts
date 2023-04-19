import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getAis = createAsyncThunk("ais/getAis", Api.getAis);
