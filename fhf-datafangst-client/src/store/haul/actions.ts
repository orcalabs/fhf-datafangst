import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api";
import { HaulsArgs } from "api/haulsApi";

export const getHauls = createAsyncThunk("haul/getHauls", api.hauls.getHauls);

export const setHaulsSearch = createAction<HaulsArgs>("haul/setHaulsSearch");
