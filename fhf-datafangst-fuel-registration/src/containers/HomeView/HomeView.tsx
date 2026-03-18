import ClearIcon from "@mui/icons-material/Clear";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Button,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import theme, { fontStyle } from "app/theme";
import { FuelLog, Header } from "components";
import { nb } from "date-fns/locale";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { createFuelMeasurement, useAppDispatch } from "store";

// Prevents all input from keys not related to input of a natural number
const numberInputLimiter = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (
    !(e.key >= "0" && e.key <= "9") &&
    e.key !== "Delete" &&
    e.key !== "Backspace" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight" &&
    e.key !== "Home" &&
    e.key !== "End" &&
    e.key !== "Shift"
  ) {
    e.preventDefault();
    return;
  }
};

export const HomeView: FC = () => {
  const dispatch = useAppDispatch();
  const [tabValue, setTabValue] = useState("gauge");
  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [newFuel, setNewFuel] = useState<string>("");
  const [newFuelAfterBunker, setNewFuelAfterBunker] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    resetForm();
    setTabValue(newValue);
  };

  const resetForm = () => {
    setNewFuel("");
    setInputDate(null);
    setNewFuelAfterBunker("");
  };

  useEffect(() => {
    if (newFuelAfterBunker.length > 0 && +newFuelAfterBunker <= +newFuel) {
      setError(true);
    } else {
      setError(false);
    }
  }, [newFuel, newFuelAfterBunker]);

  return (
    <Stack
      sx={{
        py: 4,
        display: "flex",
        bgcolor: "rgb(237, 240, 243)",
      }}
    >
      <Header onResetTabValue={() => setTabValue("gauge")} />

      <Stack
        sx={{
          pt: "40px",
          width: "fit-content",
          marginInline: "auto",
        }}
        spacing={4}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              color: "#818799",
              borderBottom: "1px solid #5B5B5B",
              "&:hover": {
                color: "primary.main",
              },
              "&.Mui-selected": {
                color: "primary.main",
                fontWeight: fontStyle.fontWeightSemiBold,
              },
            },
          }}
        >
          <Tab value={"gauge"} label="Peiling" />
          <Tab value={"refuel"} label="Bunkring" />
          <Tab value={"log"} label="Logg" />
        </Tabs>
        {tabValue === "log" ? (
          <FuelLog />
        ) : (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nb}>
            <Stack spacing={3} alignItems="center">
              <Stack spacing={2} alignItems="flex-start">
                <Stack spacing={0.5}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.grey[500] }}
                  >
                    Tidspunkt
                  </Typography>
                  <DateTimePicker
                    sx={{ width: 274 }}
                    disableFuture
                    slotProps={{
                      field: {
                        clearable: true,
                      },
                      textField: {
                        color: "secondary",
                        placeholder: "Nå",
                      },
                    }}
                    value={inputDate}
                    enableAccessibleFieldDOMStructure={false}
                    onChange={(value) => setInputDate(value)}
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.grey[500] }}
                  >
                    {tabValue === "gauge"
                      ? "Drivstoff"
                      : "Drivstoff før bunkring"}
                  </Typography>
                  <TextField
                    sx={{ width: tabValue === "gauge" ? 160 : 205 }}
                    variant="outlined"
                    color="secondary"
                    value={newFuel}
                    placeholder="Antall liter"
                    onKeyDown={numberInputLimiter}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setNewFuel(event.target.value)
                    }
                    slotProps={{
                      input: {
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
                {tabValue === "refuel" && (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: theme.palette.grey[500] }}
                    >
                      Drivstoff etter bunkring
                    </Typography>
                    <TextField
                      sx={{
                        width: 205,
                        "& .MuiFormHelperText-root": {
                          position: "absolute",
                          top: 55,
                          mx: "2px",
                        },
                      }}
                      placeholder="Antall liter"
                      color="secondary"
                      variant="outlined"
                      error={error}
                      helperText={
                        error ? "Må være større enn før bunkring" : ""
                      }
                      value={newFuelAfterBunker}
                      onKeyDown={numberInputLimiter}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setNewFuelAfterBunker(event.target.value)
                      }
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {newFuelAfterBunker && (
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
                )}
              </Stack>
              <Stack direction="row" spacing={3} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    alignItems: "center",
                    bgcolor: "grey.A400",
                  }}
                  disabled={
                    newFuel === "" ||
                    error ||
                    (tabValue === "refuel" && !newFuelAfterBunker)
                  }
                  startIcon={<PostAddIcon />}
                  onClick={() => {
                    dispatch(
                      createFuelMeasurement({
                        timestamp: inputDate
                          ? inputDate.toISOString()
                          : new Date().toISOString(),
                        fuel: +newFuel,
                        fuelAfter:
                          tabValue === "refuel" && newFuelAfterBunker
                            ? +newFuelAfterBunker
                            : null,
                      }),
                    );

                    resetForm();
                  }}
                >
                  Registrer
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
          </LocalizationProvider>
        )}
      </Stack>
    </Stack>
  );
};
