import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { useMemo, type FC } from "react";
import { StyledPopper } from "~/components";
import type { Quality } from "~/generated/openapi";
import {
  selectQualitiesMap,
  selectQualitiesSorted,
  useAppSelector,
} from "~/store";

interface Props {
  value?: Quality;
  onChange: (_?: Quality) => void;
}

export const QualitySelect: FC<Props> = ({ value, onChange }) => {
  const qualities = useAppSelector(selectQualitiesSorted);
  const qualitiesMap = useAppSelector(selectQualitiesMap);

  const options = useMemo(() => qualities?.map((v) => v.id) ?? [], [qualities]);

  return (
    <Stack spacing={0.5}>
      <Typography sx={{ fontWeight: "bold" }}>Kvalitet</Typography>
      <Autocomplete
        size="small"
        blurOnSelect
        limitTags={3}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={value ?? null}
        onChange={(_, value) => onChange(value ?? undefined)}
        options={options}
        getOptionLabel={(option) => qualitiesMap?.[option]?.name ?? option}
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
