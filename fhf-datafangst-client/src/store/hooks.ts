import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppState } from "./state";
import type { AppDispatch } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
