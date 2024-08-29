import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Autocomplete, Checkbox, TextField, Typography } from "@mui/material";
import { StyledDatePopper } from "components";
import { FC, useMemo } from "react";

export const getAllYearsArray = (minYear: number) =>
  Array.from(
    { length: new Date().getFullYear() - minYear + 1 },
    (_, i) => i + minYear,
  );

interface Props {
  value?: number[];
  minYear: number;
  onChange: (_?: number[]) => void;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const YearsFilter: FC<Props> = (props) => {
  const { value, onChange } = props;

  const values = useMemo(() => value?.slice().sort(), [value]);

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        År
      </Typography>
      <Autocomplete
        sx={{
          "& .MuiAutocomplete-inputRoot": { color: "text.secondary" },
          "& .MuiInputBase-root": { pb: "6px" },
          "& .MuiIconButton-root": { color: "text.secondary" },
          "& .MuiChip-filled": {
            color: "black",
            bgcolor: "secondary.main",
            borderRadius: 0,
          },
        }}
        multiple
        disableCloseOnSelect
        componentsProps={{ popper: { placement: "right-start" } }}
        ChipProps={{ deleteIcon: <DisabledByDefaultIcon /> }}
        size="small"
        PopperComponent={StyledDatePopper}
        limitTags={3}
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={values ?? []}
        onChange={(_, value) => onChange(value?.length ? value : undefined)}
        options={getAllYearsArray(props.minYear)}
        getOptionLabel={(option: number) => option.toString()}
        renderInput={(params: any) => (
          <TextField {...params} variant="standard" />
        )}
        renderOption={(props, option, { selected }) => (
          <li {...props} style={{ paddingLeft: 6, paddingRight: 6 }}>
            <Checkbox
              disableRipple
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )}
      />
    </>
  );
};
