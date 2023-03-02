import { FC, useMemo } from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { StyledPopper } from "components";

interface Props {
  value?: number[];
  onChange: (_?: number[]) => void;
}

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
        ChipProps={{ deleteIcon: <DisabledByDefaultIcon /> }}
        size="small"
        blurOnSelect
        PopperComponent={StyledPopper}
        limitTags={3}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={values ?? []}
        onChange={(_, value) => onChange(value?.length ? value : undefined)}
        options={Array.from(new Array(12), (x, i) => i + 1)}
        getOptionLabel={(option: number) => option.toString()}
        renderInput={(params: any) => <TextField {...params} />}
      />
    </>
  );
};
