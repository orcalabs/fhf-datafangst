import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import { useMemo, type FC } from "react";
import { StyledPopper } from "~/components";
import type { Condition } from "~/generated/openapi";
import {
  selectConditionsMap,
  selectConditionsSorted,
  useAppSelector,
} from "~/store";

interface Props {
  value?: Condition;
  onChange: (_?: Condition) => void;
}

export const ConditionSelect: FC<Props> = ({ value, onChange }) => {
  const qualities = useAppSelector(selectConditionsSorted);
  const qualitiesMap = useAppSelector(selectConditionsMap);

  const options = useMemo(() => qualities?.map((v) => v.id) ?? [], [qualities]);

  return (
    <Stack spacing={0.5}>
      <Typography sx={{ fontWeight: "bold" }}>Tilstand</Typography>
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
        getOptionLabel={(option) => {
          const name = qualitiesMap?.[option]?.name ?? option;
          return name === "Ukjent" ? option : name;
        }}
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
