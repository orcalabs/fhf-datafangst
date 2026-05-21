import ClearIcon from "@mui/icons-material/Clear";
import PhishingIcon from "@mui/icons-material/Phishing";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  type TextFieldProps,
} from "@mui/material";
import { useEffect, useState, type ChangeEvent, type FC } from "react";
import { Controller, Form, useForm } from "react-hook-form";
import theme from "~/app/theme";
import { LocalLoadingProgress, StartedHaul } from "~/components";
import { useAppDispatch, useAppSelector } from "~/store";
import {
  abortUserHaul,
  getActiveUserHaul,
  selectActiveUserHaul,
  selectActiveUserHaulLoading,
  startUserHaul,
  stopUserHaul,
} from "~/store/userHaul";
import { numberInputLimiter } from "~/utils";

export interface Config {
  trawl: {
    name: string;
    bag: string;
  }[];

  clump: {
    amount: number;
    weight: number;
  };
  doors: {
    amount: string;
    weight: number;
  };
  oversweeper: {
    length: number;
    thickness: number;
  };
  undersweeper: {
    length: number;
    thickness: number;
  };
  gear: {
    amount: number;
    weight: number;
  };
  bobbins: {
    weight: number;
    amount: number;
    placement: string;
  };
  comments: string;
}

const trawlOptions = [
  { name: "Trål 1", bag: "A" },
  { name: "Trål 2", bag: "B" },
  { name: "Trål 3", bag: "C" },
];

export const UserHaul: FC = () => {
  const dispatch = useAppDispatch();

  const activeHaul = useAppSelector(selectActiveUserHaul);
  const activeHaulLoading = useAppSelector(selectActiveUserHaulLoading);

  const { control, register, reset } = useForm<Config>({});

  const [newFuel, setNewFuel] = useState<string>("");

  const resetForm = () => {
    reset();
    setNewFuel("");
  };

  useEffect(() => {
    dispatch(getActiveUserHaul({}));
  }, []);

  if (activeHaulLoading) {
    return <LocalLoadingProgress color={theme.palette.primary.main} />;
  }

  const onStartHaul = (config: Config) => {
    dispatch(
      startUserHaul({
        config,
        fuelLiterStart: +newFuel,
      }),
    );
  };

  const onStopHaul = (fuelLiter: number) => {
    dispatch(
      stopUserHaul({
        fuelLiterEnd: fuelLiter,
      }),
    );
  };

  const onAbortHaul = () => {
    dispatch(abortUserHaul({}));
  };

  return (
    <Box sx={{ px: 2 }}>
      {activeHaulLoading ? (
        <LocalLoadingProgress color={theme.palette.primary.main} />
      ) : activeHaul ? (
        <StartedHaul
          haul={activeHaul}
          onStop={(fuelLiter) => onStopHaul(fuelLiter)}
          onAbort={onAbortHaul}
        />
      ) : (
        <>
          <Form
            control={control}
            onSubmit={async ({ data }) => {
              onStartHaul(data);
            }}
          >
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Typography variant="h6">
                  Drivstoff i tanken <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  required
                  sx={{ width: 205 }}
                  variant="outlined"
                  color="secondary"
                  value={newFuel}
                  placeholder="Antall liter"
                  onKeyDown={numberInputLimiter}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setNewFuel(event.target.value)
                  }
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    },
                    input: {
                      inputMode: "numeric",
                      endAdornment: (
                        <InputAdornment position="end">
                          {newFuel && (
                            <Typography sx={{ fontSize: "0.9rem" }}>
                              liter
                            </Typography>
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Stack>
              <Stack spacing={1} sx={{ alignSelf: "flex-start" }}>
                <Typography variant="h6">Trål</Typography>
                <Controller
                  name="trawl"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <FormGroup row sx={{ gap: 2 }}>
                      {trawlOptions.map((option) => {
                        const checked = field.value.some(
                          (t) => t.name === option.name,
                        );

                        return (
                          <FormControlLabel
                            key={option.name}
                            label={option.name}
                            control={
                              <Checkbox
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([...field.value, option]);
                                  } else {
                                    field.onChange(
                                      field.value.filter(
                                        (t) => t.name !== option.name,
                                      ),
                                    );
                                  }
                                }}
                              />
                            }
                          />
                        );
                      })}
                    </FormGroup>
                  )}
                />
              </Stack>

              <Divider
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.15)",
                }}
              />

              <Stack direction="row" spacing={4}>
                <Stack spacing={2}>
                  <Typography variant="h6">Lodd</Typography>
                  <NumberedTextField
                    variant="outlined"
                    label="Antall"
                    {...register("clump.amount")}
                  />
                  <NumberedTextField
                    variant="outlined"
                    label="Vekt"
                    {...register("clump.weight")}
                  />
                </Stack>
                <Divider
                  variant="middle"
                  orientation="vertical"
                  flexItem
                  sx={{
                    bgcolor: "rgba(0, 0, 0, 0.15)",
                  }}
                />
                <Stack spacing={2}>
                  <Typography variant="h6">Dører</Typography>
                  <NumberedTextField
                    variant="outlined"
                    label="Antall"
                    {...register("doors.amount")}
                  />
                  <NumberedTextField
                    variant="outlined"
                    label="Vekt"
                    {...register("doors.weight")}
                  />
                </Stack>
              </Stack>
              <Divider sx={{ bgcolor: "rgba(0, 0, 0, 0.15)" }} />

              <Stack direction="row" spacing={4}>
                <Stack spacing={2}>
                  <Typography variant="h6">Oversweeper</Typography>
                  <NumberedTextField
                    variant="outlined"
                    label="Lengde"
                    {...register("oversweeper.length")}
                  />
                  <NumberedTextField
                    variant="outlined"
                    label="Tykkelse"
                    {...register("oversweeper.thickness")}
                  />
                </Stack>
                <Divider
                  variant="middle"
                  orientation="vertical"
                  flexItem
                  sx={{
                    bgcolor: "rgba(0, 0, 0, 0.15)",
                  }}
                />
                <Stack spacing={2}>
                  <Typography variant="h6">Undersweeper</Typography>
                  <NumberedTextField
                    variant="outlined"
                    label="Lengde"
                    {...register("undersweeper.length")}
                  />
                  <NumberedTextField
                    variant="outlined"
                    label="Tykkelse"
                    {...register("undersweeper.thickness")}
                  />
                </Stack>
              </Stack>
              <Divider sx={{ bgcolor: "rgba(0, 0, 0, 0.15)" }} />
              <Stack direction="row" spacing={4}>
                <Stack spacing={2}>
                  <Typography variant="h6">Gir</Typography>
                  <NumberedTextField
                    variant="outlined"
                    label="Antall"
                    {...register("gear.amount")}
                  />
                  <NumberedTextField
                    variant="outlined"
                    label="Vekt"
                    {...register("gear.weight")}
                  />
                </Stack>
                <Divider
                  variant="middle"
                  orientation="vertical"
                  flexItem
                  sx={{
                    bgcolor: "rgba(0, 0, 0, 0.15)",
                  }}
                />
                <Stack spacing={2}>
                  <Typography variant="h6">Bobbinser</Typography>
                  <NumberedTextField
                    variant="outlined"
                    label="Antall"
                    {...register("bobbins.amount")}
                  />
                  <NumberedTextField
                    variant="outlined"
                    label="Vekt"
                    {...register("bobbins.weight")}
                  />
                  <TextField
                    variant="outlined"
                    label="Plassering"
                    multiline
                    rows={3}
                    {...register("bobbins.placement")}
                  />
                </Stack>
              </Stack>

              <Divider sx={{ bgcolor: "rgba(0, 0, 0, 0.15)" }} />

              <TextField
                variant="filled"
                multiline
                rows={3}
                label="Kommentarer"
                {...register("comments")}
              />
              <Stack
                direction="row"
                spacing={3}
                sx={{ pt: 1, justifyContent: "space-between" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    width: 170,
                    alignItems: "center",
                    bgcolor: "grey.A400",
                  }}
                  disabled={newFuel === ""}
                  startIcon={<PhishingIcon />}
                  type="submit"
                >
                  Start hal
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="inherit"
                  sx={{
                    color: "#696F74",
                    alignItems: "center",
                  }}
                  startIcon={<ClearIcon />}
                  onClick={() => resetForm()}
                >
                  Nullstill
                </Button>
              </Stack>
            </Stack>
          </Form>
        </>
      )}
    </Box>
  );
};

const NumberedTextField = ({ slotProps, ...props }: TextFieldProps) => {
  return (
    <TextField
      {...props}
      onKeyDown={numberInputLimiter}
      slotProps={{
        htmlInput: {
          inputMode: "numeric",
          pattern: "[0-9]*",
        },
        ...slotProps,
      }}
    />
  );
};
