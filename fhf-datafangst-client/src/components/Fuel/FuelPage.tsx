import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { nb } from "date-fns/locale";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import theme from "~/app/theme";
import {
  ConfirmModal,
  LocalLoadingProgress,
  OverlayScrollbars,
} from "~/components";
import { useTimestampUpdater } from "~/hooks";
import {
  createBunkering,
  createFuelMeasurement,
  deleteBunkering,
  deleteFuelMeasurement,
  getFuelMeasurementsAndBunkerings,
  selectFuelMeasurementsAndBunkerings,
  selectFuelMeasurementsAndBunkeringsLoading,
  selectUserConsent,
  setConsentDialogOpen,
  updateBunkering,
  updateFuelMeasurement,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { dateFormat, numberInputLimiter } from "~/utils";
import type { Confirm } from "../Common/ConfirmModal";

const isValidDate = (d: Date) => {
  return d instanceof Date && !isNaN(d.valueOf());
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderColor: theme.palette.grey[400],
  },
  [`&.${tableCellClasses.head}`]: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.palette.secondary.dark,
    borderColor: theme.palette.grey[400],
  },
}));

interface EditFuel {
  type: string;
  index: number;
  id: number;
  timestamp: Date | null;
  fuel: number;
  error: boolean;
}

export const FuelPage: FC = () => {
  const dispatch = useAppDispatch();
  const minuteTime = useTimestampUpdater();

  const fuelLog = useAppSelector(selectFuelMeasurementsAndBunkerings);
  const loading = useAppSelector(selectFuelMeasurementsAndBunkeringsLoading);
  const consent = useAppSelector(selectUserConsent);

  const [confirmRegistration, setConfirmRegistration] = useState<
    Confirm | undefined
  >(undefined);
  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [newFuel, setNewFuel] = useState<string>("");
  const [editEntry, setEditEntry] = useState<EditFuel | undefined>(undefined);

  const [inputType, setInputType] = useState<string>("measurement");

  useEffect(() => {
    if (!fuelLog) {
      dispatch(getFuelMeasurementsAndBunkerings({}));
    }
  }, []);

  const resetEdit = () => {
    setEditEntry(undefined);
  };

  const handleInputTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment !== null) {
      setInputType(newAlignment);
    }
  };

  const lastFuelMeasurement = fuelLog?.find((f) => f.type === "fuelMeasurement")
    ?.value.fuel;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#EDF0F3",
      }}
    >
      <OverlayScrollbars darkTheme style={{ height: "100%" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nb}>
          <Stack sx={{ p: 3, width: "100%" }} spacing={3}>
            <Stack spacing={2}>
              <Typography variant="h2" sx={{ color: "black" }}>
                Registrer drivstoff
              </Typography>
              <Typography>
                Fartøy som anvender drivstoffmålere (flowmeter) kan bruke
                skjemaet under til å registrere avlesninger av mengde drivstoff
                som er brukt til enhver tid.
                <br />
                Regelmessige (og helst hyppige) målinger gir mer detaljert
                analyse av drivstofforbruket under ulike faser av fisket.
              </Typography>
              <Typography>
                Dersom man i tillegg ønsker å holde oversikt over egne
                bunkringer kan man bruke skjemaet under til å loggføre dette
                også.{" "}
              </Typography>
              <Typography>
                For korrekt kalkulering av forbruket ditt bør flowmeteret leses
                av og registereres når:
              </Typography>
              <Stack sx={{ pl: 2 }}>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  1: Fartøyet forlater havn
                </Typography>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  2: Fartøyet ankommer havn
                </Typography>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  3: Redskap settes i sjøen (start av hal)
                </Typography>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  4: Redskap tas opp av sjøen (slutt av hal)
                </Typography>
              </Stack>
              <Typography sx={{ color: theme.palette.error.main }}>
                NB: Dersom du nullstiller flowmeteret på ditt fartøy bør du
                registrere avlesninger både før og etter. (Etter nullstilling
                registreres verdien 0 i skjemaet).
              </Typography>
            </Stack>
            <Divider />
            <Stack
              spacing={1}
              sx={{
                p: 4,
                bgcolor: "#E6E8EF",
                borderRadius: 2,
                width: "fit-content",
              }}
            >
              <ToggleButtonGroup
                sx={{ width: 250 }}
                color="info"
                size="small"
                value={inputType}
                exclusive
                onChange={handleInputTypeChange}
              >
                <ToggleButton value="measurement">Peiling</ToggleButton>
                <ToggleButton value="bunker">Bunkring</ToggleButton>
              </ToggleButtonGroup>
              <Stack
                direction="row"
                spacing={2}
                sx={{ width: "50%", alignItems: "flex-start" }}
              >
                <Stack spacing={0.5}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.grey[500] }}
                  >
                    {inputType === "measurement" ? (
                      <>Drivstoffmåler / Flowmeter</>
                    ) : (
                      <>Bunkret</>
                    )}
                  </Typography>
                  <TextField
                    sx={{ width: 190 }}
                    size="small"
                    variant="outlined"
                    value={newFuel}
                    placeholder="Antall liter"
                    onKeyDown={numberInputLimiter}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setNewFuel(event.target.value)
                    }
                  />
                </Stack>
                <Stack spacing={0.5}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.grey[500] }}
                  >
                    Tidspunkt
                  </Typography>
                  <DateTimePicker
                    disableFuture
                    sx={{
                      width: 250,
                      "& .MuiPickersOutlinedInput-notchedOutline legend": {
                        maxWidth: 0,
                        visibility: "hidden",
                      },
                      "& .MuiInputLabel-root": {
                        color: "text.disabled",
                      },
                      "& .MuiInputLabel-shrink": {
                        display: "none",
                      },
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                      field: {
                        clearable: true,
                      },
                    }}
                    value={inputDate ?? minuteTime}
                    onChange={(value) => setInputDate(value)}
                  />
                </Stack>
                <Button
                  variant="contained"
                  sx={{
                    minWidth: 150,
                    height: 40,
                    alignItems: "center",
                    alignSelf: "flex-end",
                  }}
                  color="success"
                  disabled={newFuel === "" || !consent}
                  startIcon={<PostAddIcon />}
                  onClick={(e) => {
                    if (inputType === "bunker") {
                      e.stopPropagation();
                      dispatch(
                        createBunkering({
                          timestamp: inputDate
                            ? inputDate.toISOString()
                            : new Date().toISOString(),
                          fuel: +newFuel,
                        }),
                      );
                    } else {
                      if (
                        lastFuelMeasurement &&
                        lastFuelMeasurement > +newFuel
                      ) {
                        e.stopPropagation();
                        setConfirmRegistration({
                          message: `Denne målingen er lavere enn forrige registrerte verdi på ${lastFuelMeasurement}. Er du sikker på at tallet du har fylt inn er korrekt?`,
                          onConfirm: () => {
                            dispatch(
                              createFuelMeasurement({
                                timestamp: inputDate
                                  ? inputDate.toISOString()
                                  : new Date().toISOString(),
                                fuel: +newFuel,
                              }),
                            );
                          },
                        });
                      } else {
                        dispatch(
                          createFuelMeasurement({
                            timestamp: inputDate
                              ? inputDate.toISOString()
                              : new Date().toISOString(),
                            fuel: +newFuel,
                          }),
                        );
                      }
                    }
                    setNewFuel("");
                    setInputDate(null);
                  }}
                >
                  Registrer
                </Button>
              </Stack>
              {!consent && (
                <Stack spacing={1}>
                  <Typography
                    sx={{
                      color: "grey.A700",
                      maxWidth: 620,
                    }}
                  >
                    * Du har ikke gitt oss samtykke for bruk av data og kan
                    derfor ikke registrere drivstoff.
                  </Typography>
                  <Button
                    color="info"
                    variant="contained"
                    sx={{ width: 200 }}
                    onClick={() => dispatch(setConsentDialogOpen(true))}
                  >
                    Åpne samtykkeskjema
                  </Button>
                </Stack>
              )}
            </Stack>
            <Stack spacing={2}>
              <Paper
                sx={{
                  width: 922,
                  bgcolor: theme.palette.grey[100],
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    pb: 3.5,
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h5">Logg</Typography>
                </Stack>
                {fuelLog && fuelLog.length ? (
                  <TableContainer>
                    <Table
                      size="small"
                      sx={{
                        tableLayout: "fixed",
                        width: 877,
                        bgcolor: theme.palette.grey[100],
                        borderRadius: 2,
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell sx={{ width: 180 }}>
                            Type
                          </StyledTableCell>
                          <StyledTableCell sx={{ width: 180 }}>
                            Tidspunkt
                          </StyledTableCell>
                          <StyledTableCell sx={{ width: 180 }} align="right">
                            Måling (liter)
                          </StyledTableCell>
                          <StyledTableCell sx={{ width: 150 }} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fuelLog?.map((f, i) => (
                          <TableRow key={i}>
                            {i === editEntry?.index && editEntry ? (
                              <>
                                <StyledTableCell>
                                  <DateTimePicker
                                    sx={{ width: 230 }}
                                    disableFuture
                                    slotProps={{
                                      textField: {
                                        size: "small",
                                      },
                                    }}
                                    value={editEntry?.timestamp}
                                    onChange={(value) => {
                                      setEditEntry({
                                        ...editEntry,
                                        timestamp: value,
                                      });
                                    }}
                                  />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  <TextField
                                    sx={{
                                      width: 120,
                                      "& .MuiInputBase-input": {
                                        textAlign: "right",
                                        pr: 1,
                                      },
                                    }}
                                    size="small"
                                    onKeyDown={numberInputLimiter}
                                    variant="outlined"
                                    value={editEntry?.fuel}
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      setEditEntry({
                                        ...editEntry,
                                        fuel: +e.target.value,
                                      })
                                    }
                                  />
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{ justifyContent: "flex-end" }}
                                  >
                                    <Button
                                      sx={{ width: 100 }}
                                      disabled={
                                        !(
                                          editEntry &&
                                          editEntry.timestamp &&
                                          isValidDate(editEntry.timestamp)
                                        ) || editEntry.error
                                      }
                                      size="small"
                                      color="success"
                                      startIcon={<DoneIcon />}
                                      onClick={() => {
                                        if (editEntry.type === "bunkering") {
                                          dispatch(
                                            updateBunkering({
                                              bunkeringId: editEntry.id,
                                              fuel: editEntry.fuel,
                                              timestamp:
                                                editEntry.timestamp!.toISOString(),
                                            }),
                                          );
                                        } else {
                                          dispatch(
                                            updateFuelMeasurement({
                                              fuelMeasurementId: editEntry.id,
                                              fuel: editEntry.fuel,
                                              timestamp:
                                                editEntry.timestamp!.toISOString(),
                                            }),
                                          );
                                        }
                                        resetEdit();
                                      }}
                                    >
                                      OK
                                    </Button>
                                    <Button
                                      sx={{ width: 100 }}
                                      size="small"
                                      color="error"
                                      startIcon={<ClearIcon />}
                                      onClick={() => resetEdit()}
                                    >
                                      Avbryt
                                    </Button>
                                  </Stack>
                                </StyledTableCell>
                              </>
                            ) : (
                              <>
                                <StyledTableCell>
                                  {f.type === "bunkering"
                                    ? "Bunkring"
                                    : "Måling"}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {dateFormat(
                                    f.value.timestamp,
                                    "dd.MM.yyyy HH:mm",
                                  )}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {f.value.fuel}
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ justifyContent: "flex-end" }}
                                  >
                                    <IconButton
                                      color="warning"
                                      size="small"
                                      onClick={() => {
                                        setEditEntry({
                                          type: f.type,
                                          index: i,
                                          id: f.value.id,
                                          fuel: f.value.fuel,
                                          timestamp: new Date(
                                            f.value.timestamp,
                                          ),
                                          error: false,
                                        });
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        if (f.type === "bunkering") {
                                          dispatch(
                                            deleteBunkering({
                                              bunkeringId: f.value.id,
                                            }),
                                          );
                                        } else {
                                          dispatch(
                                            deleteFuelMeasurement({
                                              fuelMeasurementId: f.value.id,
                                            }),
                                          );
                                        }
                                        resetEdit();
                                      }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Stack>
                                </StyledTableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : loading ? (
                  <Box sx={{ width: "fit-content", marginRight: "auto" }}>
                    <LocalLoadingProgress color="black" />
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      pl: 1,
                      fontStyle: "italic",
                      bgcolor: theme.palette.grey[100],
                    }}
                  >
                    Ingen målinger registrert
                  </Typography>
                )}
              </Paper>
            </Stack>
          </Stack>
          {confirmRegistration && (
            <ConfirmModal
              {...confirmRegistration}
              open
              title="Bekreft måling"
              buttonConfirmText="Bekreft"
              onClose={() => setConfirmRegistration(undefined)}
            />
          )}
        </LocalizationProvider>
      </OverlayScrollbars>
    </Box>
  );
};
