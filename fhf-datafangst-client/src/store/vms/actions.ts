import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getVms = createAsyncThunk("vms/getVms", Api.getVms);
