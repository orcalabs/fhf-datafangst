import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Api from "api";

export const getUser = createAsyncThunk("user/getUser", Api.getUser);

export const updateUser = createAsyncThunk("user/updateUser", Api.updateUser);
