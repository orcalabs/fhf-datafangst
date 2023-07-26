import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { HaulFilters, LandingFilters } from "components";
import { FC, useEffect } from "react";
import {
  initialHaulsMatrixSearch,
  initialLandingsMatrixSearch,
  MatrixToggle,
  selectMatrixToggle,
  setHaulsMatrixSearch,
  setLandingsMatrixSearch,
  setMatrixToggle,
  useAppDispatch,
  useAppSelector,
} from "store";

export const CatchData: FC = () => {
  const dispatch = useAppDispatch();
  const toggle = useAppSelector(selectMatrixToggle);

  const onToggleChange = (_: any, value: MatrixToggle) => {
    if (value !== null) {
      dispatch(setMatrixToggle(value));
    }
  };

  useEffect(() => {
    dispatch(
      toggle === MatrixToggle.Haul
        ? setHaulsMatrixSearch({
            ...initialHaulsMatrixSearch,
            filter: undefined,
          })
        : setLandingsMatrixSearch({
            ...initialLandingsMatrixSearch,
            filter: undefined,
          }),
    );
  }, [toggle]);

  return (
    <Box sx={{ height: "100%", px: 2.5, py: 1 }}>
      <ToggleButtonGroup
        color="secondary"
        value={toggle}
        exclusive
        onChange={onToggleChange}
      >
        <ToggleButton value={MatrixToggle.Haul}>Hal</ToggleButton>
        <ToggleButton value={MatrixToggle.Landing}>Landing</ToggleButton>
      </ToggleButtonGroup>

      {toggle === MatrixToggle.Haul ? <HaulFilters /> : <LandingFilters />}
    </Box>
  );
};
