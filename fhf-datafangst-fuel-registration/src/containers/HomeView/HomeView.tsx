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
import {
  selectBwUserLoading,
  selectBwUserProfile,
  selectUserLoading,
  useAppSelector,
} from "~/store";

const TABS = [
  {
    key: "peiling",
    Element: Gauge,
  },
  {
    key: "hal",
    Element: UserHaul,
  },
  {
    key: "bunkring",
    Element: Bunker,
  },
  { key: "logg", Element: FuelLog },
];

export const HomeView: FC = () => {
  const bwUser = useAppSelector(selectBwUserProfile);
  const bwUserLoading = useAppSelector(selectBwUserLoading);
  const userLoading = useAppSelector(selectUserLoading);

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
        {userLoading || bwUserLoading ? (
          <LocalLoadingProgress color={theme.palette.primary.main} />
        ) : bwUser ? (
          <>
            {bwUser.fiskInfoProfile?.ircs ? (
              <Tabs tabs={TABS} />
            ) : (
              <Typography variant="h6" align="center">
                Finner ingen fartøy tilknyttet din profil i BarentsWatch
                FiskInfo.
              </Typography>
            )}
          </>
        ) : (
          <Stack sx={{ px: 3, alignItems: "center" }} spacing={3}>
            <Typography variant="h5">Beklager!</Typography>
            <Stack spacing={2}>
              <Typography variant="h6" align="center">
                En feil oppsto ved henting av din profil fra BarentsWatch
                FiskInfo.
              </Typography>
              <Typography variant="h6" align="center">
                Prøv igjen senere.
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
      <ConfirmSnackbar />
    </Stack>
  );
};
