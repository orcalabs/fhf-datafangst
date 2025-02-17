import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
  Box,
  Button,
  Divider,
  IconButton,
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import theme from "app/theme";
import { FileUpload, LocalLoadingProgress } from "components";
import { nb } from "date-fns/locale";
import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  createFuelMeasurement,
  deleteFuelMeasurement,
  getFuelMeasurements,
  selectFuelMeasurements,
  selectFuelMeasurementsLoading,
  updateFuelMeasurement,
  uploadFuelMeasurements,
  useAppDispatch,
  useAppSelector,
} from "store";
import { dateFormat, numberInputLimiter } from "utils";

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
  fuelAfter: number | null;
}

export const FuelPage: FC = () => {
  const dispatch = useAppDispatch();

  const fuel = useAppSelector(selectFuelMeasurements);
  const loading = useAppSelector(selectFuelMeasurementsLoading);

  const [inputType, setInputType] = useState<string>("measurement");
  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [newFuel, setNewFuel] = useState<string>("");
  const [newFuelAfterBunker, setNewFuelAfterBunker] = useState<string>("");
  const [editEntry, setEditEntry] = useState<EditFuel | undefined>({
    id: -1,
    fuel: 0,
    fuelAfter: null,
    timestamp: null,
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
    setInputType(newAlignment);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nb}>
      <Stack sx={{ p: 1, width: "100%" }} spacing={3}>
        <Stack spacing={1} sx={{ color: theme.palette.grey[800] }}>
          <Typography variant="h5" sx={{ color: "black" }}>
            Rapporter drivstoff
          </Typography>
          <Typography>
            Registrer mengde drivstoff i tanken på gitte tidspunkt. Regelmessige
            målinger gir mer detaljert analyse av fisket. For korrekt
            kalkulering av forbruket må drivstoff registreres når:{" "}
          </Typography>
          <Stack sx={{ pl: 2 }}>
            <Typography>1: Fartøyet forlater havn</Typography>
            <Typography>2: Fartøyet ankommer havn</Typography>
            <Typography>3: Fartøyet fyller drivstoff</Typography>
          </Stack>
          <Typography>
            Hvis man i tillegg registrerer drivstoff før og etter
            fiskeoperasjoner (hal) vil det gi mer korrekte resultater.
          </Typography>
        </Stack>

        <Divider />

        <FileUpload
          accept=".xlsx"
          onChange={(file) => {
            dispatch(uploadFuelMeasurements({ file }));
          }}
        >
          <IconButton>
            <FileUploadIcon />
          </IconButton>
        </FileUpload>

        <Divider />

        <Stack
          spacing={1}
          sx={{
            p: 3,
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
          <Stack direction="row" sx={{ width: "50%" }} spacing={2}>
            <Stack spacing={0.5}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.grey[500] }}
              >
                {inputType === "measurement"
                  ? "Drivstoff (liter)"
                  : "Drivstoff før bunkring (liter)"}
              </Typography>
              <TextField
                sx={{ width: inputType === "measurement" ? 125 : 205 }}
                size="small"
                variant="outlined"
                value={newFuel}
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
                  Drivstoff etter bunkring (liter)
                </Typography>
                <TextField
                  sx={{ width: 205 }}
                  size="small"
                  variant="outlined"
                  value={newFuelAfterBunker}
                  onKeyDown={numberInputLimiter}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setNewFuelAfterBunker(event.target.value)
                  }
                />
              </Stack>
            )}
            <Stack spacing={0.5} sx={{ alignSelf: "flex-end" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.grey[500] }}
              >
                Tidspunkt
              </Typography>
              <DateTimePicker
                sx={{ width: 250 }}
                disableFuture
                slotProps={{
                  field: {
                    clearable: true,
                  },
                  textField: {
                    placeholder: "Nå",
                    size: "small",
                  },
                }}
                value={inputDate}
                onChange={(value) => setInputDate(value)}
              />
            </Stack>
            <Box sx={{ alignSelf: "flex-end" }}>
              <Button
                variant="contained"
                sx={{ minWidth: 150, height: 40, alignItems: "center" }}
                color="success"
                disabled={newFuel === ""}
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
            </Box>
          </Stack>
        </Stack>
        <Stack spacing={2}>
          <Typography variant="h5">Logg</Typography>
          {fuel && fuel.length ? (
            <TableContainer>
              <Table size="small" sx={{ tableLayout: "fixed", width: 850 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Måling (liter)</StyledTableCell>
                    <StyledTableCell>
                      Måling etter bunkring (liter)
                    </StyledTableCell>
                    <StyledTableCell>Tidspunkt</StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fuel?.map((f, i) => (
                    <TableRow key={i}>
                      {f.id === editEntry?.id && editEntry ? (
                        <>
                          <StyledTableCell>
                            <TextField
                              sx={{ width: 120 }}
                              size="small"
                              type="number"
                              variant="outlined"
                              value={editEntry?.fuel}
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) =>
                                setEditEntry({
                                  ...editEntry,
                                  fuel: +event.target.value,
                                })
                              }
                            />
                          </StyledTableCell>
                          <StyledTableCell>
                            <TextField
                              sx={{ width: 120 }}
                              size="small"
                              type="number"
                              variant="outlined"
                              value={editEntry?.fuelAfter}
                              onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                              ) =>
                                setEditEntry({
                                  ...editEntry,
                                  fuelAfter: +event.target.value,
                                })
                              }
                            />
                          </StyledTableCell>
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
                            <Stack
                              direction="row"
                              justifyContent="flex-end"
                              spacing={1}
                            >
                              <Button
                                sx={{ width: 100 }}
                                disabled={
                                  !(
                                    editEntry &&
                                    editEntry.timestamp &&
                                    isValidDate(editEntry.timestamp) &&
                                    editEntry.fuel
                                  )
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
                          <StyledTableCell>{f.fuel}</StyledTableCell>
                          <StyledTableCell>{f.fuelAfter}</StyledTableCell>
                          <StyledTableCell>
                            {dateFormat(f.timestamp, "dd.MM.yyyy HH:mm")}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Stack
                              direction="row"
                              spacing={2}
                              justifyContent="flex-end"
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
            <Typography sx={{ pl: 1, fontStyle: "italic" }}>
              Ingen målinger registrert
            </Typography>
          )}
        </Stack>
      </Stack>
    </LocalizationProvider>
  );
};
