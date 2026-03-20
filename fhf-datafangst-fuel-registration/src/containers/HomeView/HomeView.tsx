import { Stack, Typography } from "@mui/material";
import theme from "app/theme";
import {
  Bunker,
  FuelLog,
  Gauge,
  Header,
  LocalLoadingProgress,
  Tabs,
} from "components";
import { FC } from "react";
import {
  selectBwUserLoading,
  selectBwUserProfile,
  selectUserLoading,
  useAppSelector,
} from "store";

export const TABS = [
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

export const HomeView: FC = () => {
  const bwUser = useAppSelector(selectBwUserProfile);
  const bwUserLoading = useAppSelector(selectBwUserLoading);
  const userLoading = useAppSelector(selectUserLoading);

  return (
    <Stack
      sx={{
        display: "flex",
        bgcolor: "rgb(237, 240, 243)",
      }}
    >
      <Header />
      <Stack
        sx={{
          py: 2,
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
          <Stack sx={{ px: 3 }} spacing={3} alignItems="center">
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
    </Stack>
  );
};
