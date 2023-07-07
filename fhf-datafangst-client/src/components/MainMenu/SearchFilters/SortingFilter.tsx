import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Ordering } from "generated/openapi";
import { FC } from "react";

const TripSorting = {
  StartDate: "startDate",
  StopDate: "stopDate",
  Weight: "weight",
} as const;

type TripsSorting = (typeof TripSorting)[keyof typeof TripSorting];

interface Props {
  value?: [TripsSorting, Ordering];
  onChange: (_: [TripsSorting, Ordering]) => void;
}

export const SortingFilter: FC<Props> = (props) => {
  const { value, onChange } = props;
  const controlValue = value?.join(" ") ?? "date desc";

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Sortering
      </Typography>
      <FormControl
        sx={{
          "& .MuiButtonBase-root": {
            "&:hover": { borderRadius: 0 },
          },
        }}
      >
        <RadioGroup
          defaultValue="female"
          name="radio-sorting"
          value={controlValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(
              (event.target as HTMLInputElement).value.split(" ") as [
                TripsSorting,
                Ordering,
              ],
            )
          }
        >
          {radioControl("Dato nyeste-eldste", "date desc")}
          {radioControl("Dato eldste-nyeste", "date asc")}
          {radioControl("Vekt høy-lav", "weight desc")}
          {radioControl("Vekt lav-høy", "weight asc")}
        </RadioGroup>
      </FormControl>
    </>
  );
};

const radioControl = (label: string, value: string) => (
  <FormControlLabel label={label} value={value} control={<Radio />} />
);
