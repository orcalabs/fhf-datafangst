import { FC, useMemo } from "react";
import { Autocomplete, Checkbox, TextField, Typography } from "@mui/material";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { StyledPopper } from "components";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const Months: Record<number, string> = {
  1: "Januar",
  2: "Februar",
  3: "Mars",
  4: "April",
  5: "Mai",
  6: "Juni",
  7: "Juli",
  8: "August",
  9: "September",
  10: "Oktober",
  11: "November",
  12: "Desember",
};

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
        multiple
        disableCloseOnSelect
        ChipProps={{ deleteIcon: <DisabledByDefaultIcon /> }}
        size="small"
        PopperComponent={StyledPopper}
        limitTags={3}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={values ?? []}
        onChange={(_, value) => onChange(value?.length ? value : undefined)}
        options={Array.from(new Array(12), (x, i) => i + 1)}
        getOptionLabel={(option: number) => Months[option]}
        renderInput={(params: any) => <TextField {...params} />}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {Months[option]}
          </li>
        )}
      />
    </>
  );
};
