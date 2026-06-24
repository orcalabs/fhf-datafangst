import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import PostAddIcon from "@mui/icons-material/PostAdd";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import type { TooltipProps } from "@mui/material";
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
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { nb } from "date-fns/locale";
import type { ChangeEvent, FC } from "react";
import { useEffect, useState } from "react";
import theme from "~/app/theme";
import {
  FileUpload,
  LocalLoadingProgress,
  OverlayScrollbars,
} from "~/components";
import { useTimestampUpdater } from "~/hooks";
import {
  createFuelMeasurement,
  deleteFuelMeasurement,
  getFuelMeasurements,
  selectFuelMeasurements,
  selectFuelMeasurementsLoading,
  selectUserConsent,
  setConsentDialogOpen,
  updateFuelMeasurement,
  uploadFuelMeasurements,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { dateFormat, numberInputLimiter } from "~/utils";

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
  id: number;
  timestamp: Date | null;
  fuel: number;
  fuelAfter: number | null | undefined;
  error: boolean;
}

export const FuelPage: FC = () => {
  const dispatch = useAppDispatch();
  const minuteTime = useTimestampUpdater();

  const fuel = useAppSelector(selectFuelMeasurements);
  const loading = useAppSelector(selectFuelMeasurementsLoading);
  const consent = useAppSelector(selectUserConsent);

  const [inputType, setInputType] = useState<string>("measurement");
  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [newFuel, setNewFuel] = useState<string>("");
  const [newFuelAfterBunker, setNewFuelAfterBunker] = useState<string>("");
  const [editEntry, setEditEntry] = useState<EditFuel | undefined>({
    id: -1,
    fuel: 0,
    fuelAfter: null,
    timestamp: null,
    error: false,
  });

  useEffect(() => {
    if (!fuel) {
      dispatch(getFuelMeasurements({}));
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

  const reportError =
    newFuelAfterBunker.length > 0 &&
    inputType === "bunker" &&
    +newFuelAfterBunker <= +newFuel;

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
                Fyll ut skjemaet på siden for å registrere mengde drivstoff som
                er i tanken på ditt fartøy på gitte tidspunkt under toktet.
                <br />
                Regelmessige (og helst hyppige) målinger gir mer detaljert
                analyse av drivstofforbruket under ulike faser av fisket.
              </Typography>
              <Typography>
                For korrekt kalkulering av forbruket må drivstoff registreres
                når:
              </Typography>
              <Stack sx={{ pl: 2 }}>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  1: Fartøyet forlater havn
                </Typography>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  2: Fartøyet ankommer havn
                </Typography>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  3: Fartøyet fyller drivstoff
                </Typography>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  4: Redskap settes i sjøen (start av hal)
                </Typography>
                <Typography sx={{ color: "#007598", fontSize: "1.1rem" }}>
                  5: Redskap tas opp av sjøen (slutt av hal)
                </Typography>
              </Stack>
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
                      <>Drivstoff i tanken</>
                    ) : (
                      <>
                        Drivstoff i tank{" "}
                        <span style={{ fontStyle: "italic" }}>før</span>{" "}
                        bunkring
                      </>
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
                {inputType === "bunker" && (
                  <Stack spacing={0.5}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: theme.palette.grey[500] }}
                    >
                      Drivstoff i tank{" "}
                      <span style={{ fontStyle: "italic" }}>etter</span>{" "}
                      bunkring
                    </Typography>
                    <TextField
                      sx={{
                        width: 205,
                        "& .MuiFormHelperText-root": {
                          position: "absolute",
                          top: 40,
                          mx: "2px",
                        },
                      }}
                      placeholder="Antall liter"
                      size="small"
                      variant="outlined"
                      error={reportError}
                      helperText={
                        reportError ? "Må være større enn før bunkring" : ""
                      }
                      value={newFuelAfterBunker}
                      onKeyDown={numberInputLimiter}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setNewFuelAfterBunker(event.target.value)
                      }
                    />
                  </Stack>
                )}
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
                  disabled={newFuel === "" || reportError || !consent}
                  startIcon={<PostAddIcon />}
                  onClick={() => {
                    dispatch(
                      createFuelMeasurement({
                        timestamp: inputDate
                          ? inputDate.toISOString()
                          : new Date().toISOString(),
                        fuel: +newFuel,
                        fuelAfter:
                          inputType === "bunker" && newFuelAfterBunker
                            ? +newFuelAfterBunker
                            : null,
                      }),
                    );

                    setNewFuel("");
                    setInputDate(null);
                    setNewFuelAfterBunker("");
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
                  <FileUpload
                    accept=".xlsx"
                    onChange={(file) => {
                      dispatch(uploadFuelMeasurements({ file }));
                    }}
                  >
                    <ImportTooltip
                      title={
                        <>
                          <Stack direction="row" spacing={1}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              Akseptert filtype:
                            </Typography>
                            <Typography
                              sx={{ color: "grey.A400", fontWeight: "bold" }}
                            >
                              .xlsx
                            </Typography>
                          </Stack>
                          <Divider sx={{ mt: 1 }} />
                          <Typography sx={{ pt: 1, color: "#5B6165" }}>
                            Gyldig kolonnestruktur:
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ pl: 1.5, color: "fourth.dark" }}
                          >
                            <Typography>Tid (dd.mm.åååå TT:MM:SS)</Typography>
                            <Typography>|</Typography>
                            <Typography>Liter</Typography>
                            <Typography>|</Typography>
                            <Typography>
                              Liter etter bunkring (valgfritt)
                            </Typography>
                          </Stack>
                          <Typography sx={{ pt: 0.5, color: "#5B6165" }}>
                            Eksempel:
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ pl: 1.5, color: "fourth.dark" }}
                          >
                            <Typography>01.01.2001 11:11:10</Typography>
                            <Typography>|</Typography>
                            <Typography>560</Typography>
                            <Typography>|</Typography>
                            <Typography>2000</Typography>
                          </Stack>
                        </>
                      }
                    >
                      <Button
                        variant="contained"
                        size="small"
                        // sx={{ minWidth: 120, height: 40, alignItems: "center" }}
                        color="secondary"
                        startIcon={<UploadFileIcon />}
                      >
                        Importer
                      </Button>
                    </ImportTooltip>
                  </FileUpload>
                </Stack>
                {fuel && fuel.length ? (
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
                            Tidspunkt
                          </StyledTableCell>
                          <StyledTableCell sx={{ width: 180 }} align="right">
                            Måling (liter)
                          </StyledTableCell>
                          <StyledTableCell sx={{ width: 250 }} align="right">
                            Måling etter bunkring (liter)
                          </StyledTableCell>
                          <StyledTableCell sx={{ width: 150 }} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fuel?.map((f, i) => (
                          <TableRow key={i}>
                            {f.id === editEntry?.id && editEntry ? (
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
                                  <TextField
                                    sx={{
                                      width: 120,
                                      "& .MuiInputBase-input": {
                                        textAlign: "right",
                                        pr: 1,
                                      },
                                    }}
                                    error={editEntry.error}
                                    size="small"
                                    onKeyDown={numberInputLimiter}
                                    variant="outlined"
                                    value={editEntry?.fuelAfter ?? ""}
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                      setEditEntry({
                                        ...editEntry,
                                        fuelAfter: e.target.value
                                          ? +e.target.value
                                          : null,
                                        error: !!(
                                          editEntry.fuel > +e.target.value
                                        ),
                                      })
                                    }
                                  />
                                  {editEntry.error && (
                                    <Typography
                                      sx={{
                                        fontWeight: 400,
                                        lineHeight: 1.66,
                                        fontSize: "0.75rem",
                                        color: "error.main",
                                        mt: "2px",
                                      }}
                                    >
                                      Må være større enn før bunkring
                                    </Typography>
                                  )}
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
                                          isValidDate(editEntry.timestamp) &&
                                          editEntry.fuel
                                        ) || editEntry.error
                                      }
                                      size="small"
                                      color="success"
                                      startIcon={<DoneIcon />}
                                      onClick={() => {
                                        dispatch(
                                          updateFuelMeasurement({
                                            id: editEntry.id,
                                            fuel: editEntry.fuel,
                                            fuelAfter: editEntry.fuelAfter,
                                            timestamp:
                                              editEntry.timestamp!.toISOString(),
                                          }),
                                        );
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
                                  {dateFormat(f.timestamp, "dd.MM.yyyy HH:mm")}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {f.fuel}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                  {f.fuelAfter}
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
                                          id: f.id,
                                          fuel: f.fuel,
                                          fuelAfter: f.fuelAfter,
                                          timestamp: new Date(f.timestamp),
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
                                        dispatch(
                                          deleteFuelMeasurement({
                                            id: f.id,
                                          }),
                                        );
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
        </LocalizationProvider>
      </OverlayScrollbars>
    </Box>
  );
};

const ImportTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.grey[300],
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 650,
    "& .MuiTypography-root": { fontSize: "0.85rem" },
    border: `1px solid ${theme.palette.grey[400]}`,
  },
}));
