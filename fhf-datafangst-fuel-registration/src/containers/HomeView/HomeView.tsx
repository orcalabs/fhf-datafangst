import "@khmyznikov/pwa-install";
import { Stack, Typography } from "@mui/material";
import type { FC } from "react";
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
import { selectLoading, selectLoggedInVessel, useAppSelector } from "~/store";

const TABS = [
  {
    key: "peiling",
    Element: Gauge,
  },

  {
    key: "bunkring",
    Element: Bunker,
  },
  { key: "logg", Element: FuelLog },
];

// Only used for Hermes and Hero in a test phase
const CUSTOMTABS = [
  {
    key: "peiling",
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
