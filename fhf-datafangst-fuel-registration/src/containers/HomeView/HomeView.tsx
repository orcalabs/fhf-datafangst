import "@khmyznikov/pwa-install";
import { Stack, Typography } from "@mui/material";
import { useEffect, type FC } from "react";
import theme from "~/app/theme";
import {
  Bunker,
  FuelLog,
  Gauge,
  LocalLoadingProgress,
  Tabs,
  UserHaul,
} from "~/components";
import { ConfirmSnackbar } from "~/components/ConfirmSnackbar/ConfirmSnackbar";
import {
  getActiveUserHaul,
  getFuelMeasurements,
  selectLoading,
  selectLoggedInVessel,
  useAppDispatch,
  useAppSelector,
} from "~/store";

const TABS = [
  {
    key: "forbruk",
    Element: Gauge,
  },
  {
    key: "bunkring",
    Element: Bunker,
  },
  { key: "logg", Element: FuelLog },
];

// Only used for Hermes and Hera in a test phase
const CUSTOMTABS = [
  {
    key: "forbruk",
    Element: Gauge,
  },
  {
    key: "bunkring",
    Element: Bunker,
  },
  {
    key: "hal",
    Element: UserHaul,
  },
  { key: "logg", Element: FuelLog },
];

export const HomeView: FC = () => {
  const loading = useAppSelector(selectLoading);
  const vessel = useAppSelector(selectLoggedInVessel);
  const dispatch = useAppDispatch();

  // Get latest fuel measurement for verifying input
  useEffect(() => {
    if (vessel) {
      dispatch(
        getFuelMeasurements({
          limit: 1,
          offset: 0,
        }),
      );
      dispatch(getActiveUserHaul({}));
    }
  }, [vessel]);

  return (
    <Stack
      sx={{
        display: "flex",
        bgcolor: "rgb(237, 240, 243)",
        pb: "calc(20px + env(safe-area-inset-bottom))",
      }}
    >
      <Stack
        sx={{
          pt: 2,
          width: "fit-content",
          marginInline: "auto",
        }}
        spacing={4}
      >
        {loading ? (
          <LocalLoadingProgress color={theme.palette.primary.main} />
        ) : (
          <>
            {vessel ? (
              <Tabs tabs={vessel.fisheryId === 1 ? CUSTOMTABS : TABS} />
            ) : (
              <Typography variant="h6" align="center">
                Finner ingen fartøy tilknyttet din profil i BarentsWatch
                FiskInfo.
              </Typography>
            )}
          </>
        )}
      </Stack>
      <ConfirmSnackbar />
    </Stack>
  );
};
