import { Stack } from "@mui/material";
import { Bunker, FuelLog, Gauge, Header, Tabs } from "components";
import { FC } from "react";

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
        <Tabs tabs={TABS} />
      </Stack>
    </Stack>
  );
};
