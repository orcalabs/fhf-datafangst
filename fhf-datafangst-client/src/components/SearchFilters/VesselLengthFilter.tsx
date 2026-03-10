import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { VesselLengthGroup } from "generated/openapi";
import { LengthGroup, LengthGroups } from "models";
import { FC, useMemo } from "react";

interface Props {
  value?: LengthGroup[];
  options?: VesselLengthGroup[];
  onChange: (_?: LengthGroup[]) => void;
}

export const VesselLengthFilter: FC<Props> = ({
  value = [],
  options,
  onChange: _onChange,
}) => {
  const lengthGroups = useMemo(
    () =>
      options
        ? LengthGroups.filter((v) => options.includes(v.id))
        : LengthGroups,
    [options],
  );

  const onChange = (value: LengthGroup[]) =>
    _onChange(value.length ? value : undefined);

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Fartøylengde
      </Typography>
      <FormGroup>
        <Grid container rowSpacing={0.1} columnSpacing={1} width={330}>
          {lengthGroups.map((val, i) => (
            <Grid key={i} size={6}>
              <FormControlLabel
                key={i}
                sx={{ "& .MuiCheckbox-root": { borderRadius: 0 } }}
                label={val.name}
                control={
                  <Checkbox
                    checkedIcon={<CheckBoxSharpIcon />}
                    icon={<CheckBoxOutlineBlankSharpIcon />}
                    size="small"
                    name={val.name}
                    checked={value.some((lg) => lg.id === val.id)}
                    onChange={(_, checked) =>
                      onChange(
                        checked
                          ? [...value, val]
                          : value.filter((g) => g.id !== val.id),
                      )
                    }
                  />
                }
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </>
  );
};
