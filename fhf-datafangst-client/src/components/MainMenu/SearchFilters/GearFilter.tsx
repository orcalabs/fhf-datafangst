import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { selectGearGroupsMap, selectTripsSearch, useAppSelector } from "store";
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import { GearGroup } from "generated/openapi";
import { getGearGroupsFromVessels } from "utils";

interface Props {
  value?: GearGroup[];
  onChange: (_?: GearGroup[]) => void;
}

export const GearFilter: FC<Props> = (props) => {
  const gearGroupsMap = useAppSelector(selectGearGroupsMap);
  const gearGroups = Object.values(gearGroupsMap);
  const tripsSearch = useAppSelector(selectTripsSearch);
  const value = props.value ?? [];
  const onChange = (value: GearGroup[]) =>
    props.onChange(value.length ? value : undefined);

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Redskap
      </Typography>
      <FormGroup>
        <Grid container rowSpacing={0.1} columnSpacing={1} width={330}>
          {gearGroups.map((val, i) => {
            if (
              tripsSearch?.vessels?.length &&
              !getGearGroupsFromVessels(tripsSearch.vessels).includes(val.id)
            ) {
              return undefined;
            }
            return (
              <Grid key={i} item xs={6}>
                <FormControlLabel
                  sx={{ "& .MuiCheckbox-root": { borderRadius: 0 } }}
                  label={val.name}
                  control={
                    <Checkbox
                      checkedIcon={<CheckBoxSharpIcon />}
                      icon={<CheckBoxOutlineBlankSharpIcon />}
                      size="small"
                      name={val.name}
                      checked={value.some((gear) => gear.id === val.id)}
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
            );
          })}
        </Grid>
      </FormGroup>
    </>
  );
};
