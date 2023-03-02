import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getVessels = createAsyncThunk("vessel/getVessels", Api.getVessels);
