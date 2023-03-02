import { FC } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { StyledPopper } from "components";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { selectSpeciesGroups, useAppSelector } from "store";
import { SpeciesGroup } from "generated/openapi";

interface Props {
  value?: SpeciesGroup[];
  onChange: (_?: SpeciesGroup[]) => void;
}

export const SpecieFilter: FC<Props> = (props) => {
  const { value, onChange } = props;
  const speciesGroups = useAppSelector(selectSpeciesGroups);

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
        ChipProps={{ deleteIcon: <DisabledByDefaultIcon /> }}
        size="small"
        blurOnSelect
        PopperComponent={StyledPopper}
        limitTags={3}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={value ?? []}
        onChange={(_, value) => onChange(value?.length ? value : undefined)}
        options={speciesGroups}
        getOptionLabel={(option: SpeciesGroup) => option.name}
        renderInput={(params: any) => <TextField {...params} />}
      />
    </Box>
  );
};
