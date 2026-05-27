import { useAuth } from "oidc-react";
import type { ReactNode } from "react";
import React, { useEffect } from "react";
import {
  checkLoggedIn,
  getConditions,
  getDeliveryPoints,
  getGear,
  getGearGroups,
  getGearMainGroups,
  getQualities,
  getSpecies,
  getSpeciesFao,
  getSpeciesFiskeridir,
  getSpeciesGroups,
  getSpeciesMainGroups,
  getVessels,
  useAppDispatch,
} from "~/store";

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
    dispatch(getConditions());
    dispatch(getQualities());
    dispatch(getDeliveryPoints());
    // dispatch(setFishingFacilitiesSearch({}));
  }, [dispatch]);

  if (isLoading) {
    return <></>;
  }

  return <main style={{ height: "100vh" }}>{children}</main>;
};
