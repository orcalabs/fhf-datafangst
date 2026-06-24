import { Stack, Typography } from "@mui/material";
import type { FC } from "react";
import type { TripsDetailedHaul } from "~/generated/openapi";

interface Props {
  haul: TripsDetailedHaul;
}
export interface Config {
  trawl: {
    name: string;
    bag: string;
  }[];

  clump: {
    amount: number;
    weight: number;
  };
  doors: {
    amount: string;
    weight: number;
  };
  oversweeper: {
    length: number;
    thickness: number;
  };
  undersweeper: {
    length: number;
    thickness: number;
  };
  gear: {
    amount: number;
    weight: number;
  };
  bobbins: {
    weight: number;
    amount: number;
    placement: string;
  };
  comments: string;
}

export const GearConfig: FC<Props> = ({ haul }) => {
  const config = haul.config as Config;

  return (
    <Stack spacing={1.5} sx={{ width: "100%", px: 2.5 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
          Drivstoff ved start
        </Typography>
        <Typography>{haul.startFuelLiter}</Typography>
      </Stack>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
          Trål
        </Typography>
        <Stack>
          {config.trawl.map((t, i) => (
            <Typography key={i}>{t.name}</Typography>
          ))}
        </Stack>
      </Stack>
      <Stack>
        <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
          Lodd
        </Typography>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Antall</Typography>
          <Typography>{config.clump.amount}</Typography>
        </Stack>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Vekt</Typography>
          <Typography>{config.clump.weight}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
          Dører
        </Typography>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Antall</Typography>
          <Typography>{config.doors.amount}</Typography>
        </Stack>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Vekt</Typography>
          <Typography>{config.doors.weight}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
          Oversweeper
        </Typography>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Lengde</Typography>
          <Typography>{config.oversweeper.length}</Typography>
        </Stack>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Tykkelse</Typography>
          <Typography>{config.oversweeper.thickness}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
          Undersweeper
        </Typography>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Lengde</Typography>
          <Typography>{config.undersweeper.length}</Typography>
        </Stack>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Tykkelse</Typography>
          <Typography>{config.undersweeper.thickness}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
          Gir
        </Typography>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Antall</Typography>
          <Typography>{config.gear.amount}</Typography>
        </Stack>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Vekt</Typography>
          <Typography>{config.gear.weight}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
          Bobbinser
        </Typography>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Antall</Typography>
          <Typography>{config.bobbins.amount}</Typography>
        </Stack>
        <Stack direction="row" sx={{ ml: 1, justifyContent: "space-between" }}>
          <Typography>Vekt</Typography>
          <Typography>{config.bobbins.weight}</Typography>
        </Stack>
      </Stack>
      {config.comments && (
        <Stack>
          <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
            Kommentarer
          </Typography>
          <Typography sx={{ ml: 1 }}>{config.comments}</Typography>
        </Stack>
      )}
    </Stack>
  );
};
