import { Box, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import theme from "app/theme";
import { HaulFilters, LandingFilters, OverlayScrollbars } from "components";
import { MatrixTab, useMatrixTab } from "hooks";
import { FC, useEffect } from "react";
import {
  initialHaulsMatrixSearch,
  initialLandingsMatrixSearch,
  selectHaulsMatrixSearch,
  selectLandingsMatrixSearch,
  setHaulsMatrixSearch,
  setLandingsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "store";

export const MatrixMenu: FC = () => {
  const dispatch = useAppDispatch();

  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const landingsSearch = useAppSelector(selectLandingsMatrixSearch);

  const [matrixTab, setMatrixTab] = useMatrixTab();

  useEffect(() => {
    dispatch(
      matrixTab === MatrixTab.Ers
        ? setHaulsMatrixSearch({
            ...initialHaulsMatrixSearch,
            ...landingsSearch,
          })
        : setLandingsMatrixSearch({
            ...initialLandingsMatrixSearch,
            ...haulsSearch,
          }),
    );
  }, [matrixTab]);

  return (
    <Stack sx={{ height: "100%", py: 1, boxSizing: "border-box" }}>
      <Box
        sx={{
          pb: 1.5,
          pt: 1,
          px: 2.5,
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
          value={matrixTab}
          onChange={(_: any, value: MatrixTab) => setMatrixTab(value)}
          sx={{ width: "100%", alignSelf: "center" }}
        >
          <ToggleButton value={MatrixTab.Ers}> ERS </ToggleButton>
          <ToggleButton value={MatrixTab.Landing}> Seddeldata </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <OverlayScrollbars style={{ flexGrow: 1 }}>
        <Box sx={{ px: 2.5 }}>
          {matrixTab === MatrixTab.Ers ? <HaulFilters /> : <LandingFilters />}
        </Box>
      </OverlayScrollbars>
    </Stack>
  );
};
