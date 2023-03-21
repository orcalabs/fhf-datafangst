import { FC } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { LengthGroup, LengthGroupCodes } from "models";
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import { ResponsiveBar } from "@nivo/bar";
import theme from "app/theme";

interface Props {
  value?: LengthGroup[];
  onChange: (_?: LengthGroup[]) => void;
}

export const LengthGroupFilter: FC<Props> = (props) => {
  const value = props.value ?? [];

  const onChange = (value: LengthGroup[]) =>
    props.onChange(value.length ? value : undefined);

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Fartøylengde
      </Typography>
      <FormGroup>
        <Grid container rowSpacing={0.1} columnSpacing={1} width={"100%"}>
          {LengthGroupCodes.map((val, i) => {
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
                      checked={value.some(
                        (lengthGroup) => lengthGroup.id === val.id,
                      )}
                      onChange={(_, checked) =>
                        onChange(
                          checked
                            ? [...value, val]
                            : value.filter((wc) => wc.id !== val.id),
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
      <Box sx={{ height: "100px" }}>
        <ResponsiveBar
          data={[
            { lengthGroup: "1", value: 1000 },
            { lengthGroup: "2", value: 500 },
          ].sort((a, b) => a.value - b.value)}
          layout="horizontal"
          indexBy={(index) => index.value.toString()}
          label={(label) => label.data.lengthGroup}
          valueScale={{ type: "linear" }}
          enableGridY={false}
          animate={false}
          tooltip={() => <></>}
          colors={[theme.palette.text.secondary]}
          axisRight={{
            tickSize: 0,
            tickPadding: 15,
            tickRotation: 0,
          }}
          margin={{
            right: 45,
            left: 5,
          }}
          onClick={(target) => {
            console.log(target);
          }}
          theme={{
            axis: {
              ticks: { text: { fontSize: 13, fill: "white" } },
            },
          }}
          onMouseEnter={(_data, event) => {
            event.currentTarget.style.fill = "lightgrey";
            event.currentTarget.style.cursor = "pointer";
          }}
          onMouseLeave={(_data, event) => {
            event.currentTarget.style.fill = theme.palette.text.secondary;
          }}
        />
      </Box>
    </>
  );
};
