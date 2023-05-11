import React, { ReactNode, useEffect } from "react";
import { Box } from "@mui/system";
import {
  ViewState,
  checkLoggedIn,
  getGear,
  getGearGroups,
  getGearMainGroups,
  getSpecies,
  getSpeciesFao,
  getSpeciesFiskeridir,
  getSpeciesGroups,
  getSpeciesMainGroups,
  getVessels,
  initialHaulsMatrixSearch,
  selectIsLoggedIn,
  setHaulsMatrixSearch,
  setViewState,
  useAppDispatch,
  useAppSelector,
} from "store";
import { useAuth } from "oidc-react";

interface Props {
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { userData, isLoading } = useAuth();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (userData && !isLoading) {
      dispatch(checkLoggedIn(userData));
    }
  }, [userData, isLoading]);

  // Switch to MyPage view if logged in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setViewState(ViewState.MyPage));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    dispatch(setHaulsMatrixSearch(initialHaulsMatrixSearch));
    dispatch(getVessels());
    dispatch(getGear());
    dispatch(getGearGroups());
    dispatch(getGearMainGroups());
    dispatch(getSpecies());
    dispatch(getSpeciesFao());
    dispatch(getSpeciesFiskeridir());
    dispatch(getSpeciesGroups());
    dispatch(getSpeciesMainGroups());
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main>{children}</main>
    </Box>
  );
};
