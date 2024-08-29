import { Box } from "@mui/system";
import { useAuth } from "oidc-react";
import React, { ReactNode, useEffect } from "react";
import {
  checkLoggedIn,
  getDeliveryPoints,
  getGear,
  getGearGroups,
  getGearMainGroups,
  getSpecies,
  getSpeciesFao,
  getSpeciesFiskeridir,
  getSpeciesGroups,
  getSpeciesMainGroups,
  getVessels,
  useAppDispatch,
} from "store";

interface Props {
  children: ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { userData, isLoading } = useAuth();

  useEffect(() => {
    if (userData && !isLoading) {
      dispatch(checkLoggedIn(userData));
    }
  }, [userData, isLoading]);

  useEffect(() => {
    dispatch(getVessels());
    dispatch(getGear());
    dispatch(getGearGroups());
    dispatch(getGearMainGroups());
    dispatch(getSpecies());
    dispatch(getSpeciesFao());
    dispatch(getSpeciesFiskeridir());
    dispatch(getSpeciesGroups());
    dispatch(getSpeciesMainGroups());
    dispatch(getDeliveryPoints());
    // dispatch(setFishingFacilitiesSearch({}));
  }, [dispatch]);

  if (isLoading) {
    return <></>;
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main>{children}</main>
    </Box>
  );
};
