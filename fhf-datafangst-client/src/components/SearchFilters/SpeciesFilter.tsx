import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { StyledPopper } from "components";
import { SpeciesGroup, SpeciesGroupDetailed } from "generated/openapi";
import { FC, useMemo } from "react";
import { selectSpeciesGroupsSortedByName, useAppSelector } from "store";

interface Props {
  value?: SpeciesGroupDetailed[];
  options?: SpeciesGroup[];
  onChange: (_?: SpeciesGroupDetailed[]) => void;
}

export const SpeciesFilter: FC<Props> = ({ value, options, onChange }) => {
  const _specieGroups = useAppSelector(selectSpeciesGroupsSortedByName);

  const specieGroups = useMemo(
    () =>
      options
        ? _specieGroups.filter((v) => options.includes(v.id))
        : _specieGroups,
    [_specieGroups, options],
  );

  return (
    <Box
      sx={{
        "& .MuiChip-filled": {
          color: "black",
          bgcolor: "secondary.main",
          borderRadius: 0,
        },
        "& .MuiButtonBase-root": {
          borderRadius: 0,

          "&:hover": {
            borderRadius: 0,
          },
        },
      }}
    >
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Art
      </Typography>
      <Autocomplete
        multiple
        size="small"
        blurOnSelect
        limitTags={3}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={value ?? []}
        onChange={(_, value) => onChange(value?.length ? value : undefined)}
        options={specieGroups}
        getOptionLabel={(option: SpeciesGroupDetailed) => option.name}
        renderInput={(params: any) => <TextField {...params} />}
        slots={{
          popper: StyledPopper,
        }}
        slotProps={{
          chip: { deleteIcon: <DisabledByDefaultIcon /> },
        }}
      />
    </Box>
  );
};
