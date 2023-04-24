import React, { ReactNode, useEffect } from "react";
import { Box } from "@mui/system";
import {
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
  setHaulsMatrixSearch,
  useAppDispatch,
} from "store";

interface Props {
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkLoggedIn());
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
