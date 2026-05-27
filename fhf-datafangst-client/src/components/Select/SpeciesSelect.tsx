import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import type { FC } from "react";
import { useMemo } from "react";
import { StyledPopper } from "~/components";
import type { SpeciesFiskeridir } from "~/generated/openapi";
import {
  selectSpeciesFiskeridirMap,
  selectSpeciesFiskeridirSorted,
  useAppSelector,
} from "~/store";

interface Props {
  value?: number;
  options?: SpeciesFiskeridir[];
  onChange: (_?: number) => void;
}

export const SpeciesSelect: FC<Props> = ({ value, options, onChange }) => {
  const _species = useAppSelector(selectSpeciesFiskeridirSorted);
  const speciesMap = useAppSelector(selectSpeciesFiskeridirMap);

  const species = useMemo(
    () =>
      (options
        ? _species.filter((v) => options.some((o) => o.id === v.id))
        : _species
      )
        .filter((v) => v.name)
        .map((v) => v.id),
    [_species, options],
  );

  return (
    <Stack spacing={0.5}>
      <Typography sx={{ fontWeight: "bold" }}>Art</Typography>
      <Autocomplete
        size="small"
        blurOnSelect
        limitTags={3}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={value ?? null}
        onChange={(_, value) => onChange(value ?? undefined)}
        options={species}
        getOptionLabel={(option) => `${speciesMap[option].name} (${option})`}
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
