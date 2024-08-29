import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import theme from "app/theme";
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
      <Box
        sx={{
          pb: 1.5,
          pt: 1,
          "& .MuiToggleButtonGroup-grouped": {
            borderRadius: 0,
            color: "text.secondary",
            borderColor: theme.palette.grey.A100,
          },
          "& .MuiToggleButton-root": {
            "&.Mui-selected": {
              backgroundColor: "secondary.main",
              color: "white",
              "&:hover": { bgcolor: "secondary.main" },
            },
            "&:hover": { bgcolor: "secondary.main" },
          },
        }}
      >
        <ToggleButtonGroup
          exclusive
          size="small"
          value={toggle}
          onChange={onToggleChange}
          sx={{ width: "100%", alignSelf: "center" }}
        >
          <ToggleButton value={MatrixToggle.Haul}> ERS </ToggleButton>
          <ToggleButton value={MatrixToggle.Landing}> Seddeldata </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {toggle === MatrixToggle.Haul ? <HaulFilters /> : <LandingFilters />}
    </Box>
  );
};
