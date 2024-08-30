import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Autocomplete, Checkbox, TextField, Typography } from "@mui/material";
import { StyledDatePopper } from "components";
import { FC, useMemo } from "react";
import { Months } from "utils";

interface Props {
  value?: number[];
  onChange: (_?: number[]) => void;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const MonthsFilter: FC<Props> = (props) => {
  const { value, onChange } = props;

  const values = useMemo(() => value?.slice().sort(), [value]);

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Måned
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
        options={Array.from({ length: 12 }, (_, i) => i + 1)}
        getOptionLabel={(option: number) => Months[option]}
        renderInput={(params: any) => (
          <TextField {...params} variant="standard" />
        )}
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            key={option}
            style={{ paddingLeft: 6, paddingRight: 6 }}
          >
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
              disableRipple
            />
            {Months[option]}
          </li>
        )}
      />
    </>
  );
};
