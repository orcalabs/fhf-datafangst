import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";

export const getVessels = createAsyncThunk(
  "vessel/getVessels",
  api.vessels.getVessels,
);
