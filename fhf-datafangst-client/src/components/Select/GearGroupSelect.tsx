import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import type { FC } from "react";
import { useMemo } from "react";
import { StyledPopper } from "~/components";
import { selectGearGroupsMap, useAppSelector } from "~/store";

import type { GearGroup } from "~/generated/openapi";
import { selectGearGroups } from "~/store";

interface Props {
  value?: GearGroup;
  options?: GearGroup[];
  onChange: (_?: GearGroup) => void;
}

export const GearGroupSelect: FC<Props> = ({
  value: _value,
  options,
  onChange,
}) => {
  const _gearGroups = useAppSelector(selectGearGroups);
  const gearGroupsMap = useAppSelector(selectGearGroupsMap);

  const gearGroups = useMemo(
    () =>
      options ? _gearGroups.filter((v) => options.includes(v.id)) : _gearGroups,
    [_gearGroups, options],
  );

  const value = _value ? gearGroupsMap[_value] : undefined;

  return (
    <Stack spacing={0.5}>
      <Typography sx={{ fontWeight: "bold" }}>Redskap</Typography>
      <Autocomplete
        size="small"
        blurOnSelect
        limitTags={3}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={value ?? null}
        onChange={(_, value) => onChange(value?.id ?? undefined)}
        options={gearGroups}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} />}
        sx={{
          bgcolor: "white",
          "& .MuiInputBase-root": {
            borderRadius: 0,
          },
        }}
        slots={{
          popper: StyledPopper,
        }}
        slotProps={{
          chip: { deleteIcon: <DisabledByDefaultIcon /> },
        }}
      />
    </Stack>
  );
};
