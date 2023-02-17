import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppState, AppDispatch } from ".";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
