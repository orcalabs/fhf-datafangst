import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneIcon from "@mui/icons-material/Done";
import EditNoteIcon from "@mui/icons-material/EditNote";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { format, isToday, isYesterday } from "date-fns";
import { nb } from "date-fns/locale";
import type { ChangeEvent, FC } from "react";
import { useEffect, useRef, useState } from "react";
import theme from "~/app/theme";
import { LocalLoadingProgress } from "~/components";
import type { Confirm } from "~/components/ConfirmModal/ConfirmModal";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  deleteFuelMeasurement,
  getFuelMeasurements,
  selectFuelMeasurements,
  selectFuelMeasurementsLoading,
  selectFuelMeasurementsScrollable,
  selectUserConsent,
  updateFuelMeasurement,
  useAppDispatch,
  useAppSelector,
} from "~/store";

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderColor: "rgba(0, 0, 0, 0.10)",
  },
  [`&.${tableCellClasses.head}`]: {
    fontSize: 16,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    fontWeight: "bold",
    color: theme.palette.secondary.dark,
    paddingTop: 11,
    paddingBottom: 11,
  },
}));

interface EditFuel {
  id: number;
  timestamp: Date | null;
  fuel: number;
  fuelAfter: number | null | undefined;
  error: boolean;
}

const isValidDate = (d: Date) => {
  return d instanceof Date && !isNaN(d.valueOf());
};

type IntoDate = Date | number | string;
const dateFormat = (d: IntoDate | undefined | null, f: string) => {
  if (!d) {
    return "";
  }

  if (isToday(d)) {
    return `I dag, ${format(new Date(d), "HH:mm", { locale: nb })}`;
  }

  if (isYesterday(d)) {
    return `I går, ${format(new Date(d), "HH:mm", { locale: nb })}`;
  }

  return d ? format(new Date(d), f, { locale: nb }) : "";
};

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

export const FuelLog: FC = () => {
  const dispatch = useAppDispatch();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isMediumResolution = useMediaQuery(theme.breakpoints.down(920));
  const isSmallResolution = useMediaQuery(theme.breakpoints.between(470, 920));
  const isMobile = useMediaQuery(theme.breakpoints.down(435));

  const fuel = useAppSelector(selectFuelMeasurements);
  const loading = useAppSelector(selectFuelMeasurementsLoading);
  const scrollable = useAppSelector(selectFuelMeasurementsScrollable);
  const consent = useAppSelector(selectUserConsent);

  const [confirmDelete, setConfirmDelete] = useState<Confirm | undefined>(
    undefined,
  );
  const [editEntry, setEditEntry] = useState<EditFuel | undefined>(undefined);
  const [offset, setOffset] = useState(0);

  const limit = 20;

  useEffect(() => {
    dispatch(getFuelMeasurements({ limit, offset }));
  }, [offset]);

  useEffect(() => {
    if (!scrollable || loading || !fuel?.length || !scrollRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOffset((v) => v + limit);
        }
      },
      { threshold: 1 },
    );

    observer.observe(scrollRef.current);

    return () => observer.disconnect();
  }, [fuel, loading, scrollable]);

  const resetEdit = () => {
    setEditEntry(undefined);
  };

  return (
    <Box sx={{ paddingBottom: scrollable && !isMobile ? 8 : undefined }}>
      {!!fuel?.length && (
        <>
          {isMediumResolution ? (
            <Stack
              spacing={1.5}
              sx={{
                width: isMobile ? "100vw" : "100%",
                px: isMobile ? 2 : 0,
              }}
            >
              {fuel.map((f, i) => (
                <Card
                  key={i}
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(0, 0, 0, 0.17)",
                    width: isSmallResolution ? 450 : "unset",
                  }}
                >
                  <CardContent sx={{ p: "0 !important" }}>
                    <TableContainer component={Paper} elevation={0}>
                      <Table>
                        <TableHead>
                          <StyledTableRow>
                            <StyledTableCell>
                              {f.fuelAfter ? "Bunkring" : "Peiling"}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent={"flex-end"}
                              >
                                <IconButton
                                  size="small"
                                  sx={{
                                    bgcolor: consent
                                      ? "#DAE4EC"
                                      : "rgba(0, 0, 0, 0.06) !important",
                                    borderRadius: 1,
                                  }}
                                  disabled={!consent}
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
                                  <EditNoteIcon
                                    fontSize="small"
                                    sx={{
                                      color: consent
                                        ? "fourth.main"
                                        : "text.disabled",
                                    }}
                                  />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  sx={{ bgcolor: "#F1DFDF", borderRadius: 1 }}
                                  onClick={() => {
                                    dispatch(
                                      deleteFuelMeasurement({
                                        id: f.id,
                                      }),
                                    );
                                    resetEdit();
                                  }}
                                >
                                  <DeleteOutlineIcon
                                    fontSize="small"
                                    sx={{ color: "error.main" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setConfirmDelete({
                                        message:
                                          "Er du sikker på at du vil slette denne målingen?",
                                        onConfirm: () => {
                                          dispatch(
                                            deleteFuelMeasurement({
                                              id: f.id,
                                            }),
                                          );
                                        },
                                      });
                                    }}
                                  />
                                </IconButton>
                              </Stack>
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableHead>
                        <TableBody>
                          <StyledTableRow>
                            <StyledTableCell>Tidspunkt</StyledTableCell>
                            <StyledTableCell align="right">
                              {dateFormat(f.timestamp, "dd.MM.yyyy, HH:mm")}
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell>
                              {f.fuelAfter ? "Liter før bunkring" : "Liter"}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {f.fuel}
                            </StyledTableCell>
                          </StyledTableRow>
                          {f.fuelAfter && (
                            <StyledTableRow>
                              <StyledTableCell>
                                Liter etter bunkring
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {f.fuelAfter}
                              </StyledTableCell>
                            </StyledTableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <TableContainer sx={{ width: 900 }}>
              <Table
                sx={{
                  bgcolor: theme.palette.grey[100],
                  borderRadius: 2,
                  tableLayout: "fixed",
                }}
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ width: 220 }}>
                      Tidspunkt
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 180 }} align="right">
                      Måling (liter)
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 250 }} align="right">
                      Måling etter bunkring (liter)
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: 240 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fuel?.map((f, i) => (
                    <TableRow key={i} sx={{ height: 85 }}>
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
                              slotProps={{
                                htmlInput: {
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                },
                                input: {
                                  inputMode: "numeric",
                                },
                              }}
                              size="small"
                              onKeyDown={numberInputLimiter}
                              variant="outlined"
                              value={editEntry?.fuel}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setEditEntry({
                                  ...editEntry,
                                  fuel: +e.target.value,
                                  error: editEntry.fuelAfter
                                    ? +e.target.value > editEntry.fuelAfter
                                    : false,
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
                                "& .MuiFormHelperText-root": {
                                  position: "absolute",
                                  top: 38,
                                  fontWeight: 400,
                                  lineHeight: 1.66,
                                  fontSize: "0.75rem",
                                  width: 180,
                                  color: "error.main",
                                  mx: "1px",
                                },
                              }}
                              slotProps={{
                                htmlInput: {
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                },
                                input: {
                                  inputMode: "numeric",
                                },
                              }}
                              error={editEntry.error}
                              size="small"
                              helperText={
                                editEntry.error &&
                                "Må være større enn før bunkring"
                              }
                              onKeyDown={numberInputLimiter}
                              variant="outlined"
                              value={editEntry?.fuelAfter ?? ""}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setEditEntry({
                                  ...editEntry,
                                  fuelAfter: e.target.value
                                    ? +e.target.value
                                    : null,
                                  error: !!(editEntry.fuel > +e.target.value),
                                })
                              }
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
                              justifyContent="flex-end"
                            >
                              <IconButton
                                title="Rediger"
                                size="small"
                                sx={{
                                  bgcolor: consent
                                    ? "#DAE4EC"
                                    : "rgba(0, 0, 0, 0.05) !important",
                                  borderRadius: 1,
                                }}
                                disabled={!consent}
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
                                <EditNoteIcon
                                  sx={{
                                    color: consent
                                      ? "fourth.main"
                                      : "text.disabled",
                                  }}
                                />
                              </IconButton>
                              <IconButton
                                title="Slett"
                                sx={{ bgcolor: "#F1DFDF", borderRadius: 1 }}
                                size="small"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete({
                                    message:
                                      "Er du sikker på at du vil slette denne målingen?",
                                    onConfirm: () => {
                                      dispatch(
                                        deleteFuelMeasurement({
                                          id: f.id,
                                        }),
                                      );
                                    },
                                  });
                                }}
                              >
                                <DeleteOutlineIcon
                                  sx={{ color: "error.main" }}
                                />
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
          )}
          <Box ref={scrollRef} sx={{ height: "20px" }} />
        </>
      )}

      {loading ? (
        <Box
          sx={{ width: "fit-content", marginInline: "auto", paddingBlock: 2 }}
        >
          <LocalLoadingProgress color={theme.palette.primary.main} />
        </Box>
      ) : (
        !fuel?.length && (
          <Typography
            sx={{
              pl: 1,
              fontStyle: "italic",
            }}
          >
            Ingen målinger registrert
          </Typography>
        )
      )}

      {confirmDelete && (
        <ConfirmModal
          {...confirmDelete}
          open
          onClose={() => setConfirmDelete(undefined)}
        />
      )}

      {editEntry && isMediumResolution && (
        <Dialog
          open={!!editEntry}
          onClose={() => setEditEntry(undefined)}
          disableScrollLock
          sx={{
            "& .MuiDialog-paper": {
              padding: 1,
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle>
            <Typography sx={{ fontSize: "1.25rem" }}>Endre måling </Typography>
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <DateTimePicker
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
              <TextField
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  },
                  input: {
                    inputMode: "numeric",
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          {editEntry.fuelAfter ? "liter før bunkring" : "liter"}
                        </Typography>
                      </InputAdornment>
                    ),
                  },
                }}
                size="small"
                onKeyDown={numberInputLimiter}
                variant="outlined"
                value={editEntry?.fuel}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditEntry({
                    ...editEntry,
                    fuel: +e.target.value,
                    error: editEntry.fuelAfter
                      ? +e.target.value > editEntry.fuelAfter
                      : false,
                  })
                }
              />
              {editEntry.fuelAfter !== undefined &&
                editEntry.fuelAfter !== null && (
                  <>
                    <TextField
                      slotProps={{
                        htmlInput: {
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        },
                        input: {
                          inputMode: "numeric",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography sx={{ fontSize: "0.9rem" }}>
                                liter etter bunkring
                              </Typography>
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={editEntry.error}
                      size="small"
                      onKeyDown={numberInputLimiter}
                      variant="outlined"
                      value={editEntry.fuelAfter}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setEditEntry({
                          ...editEntry,
                          fuelAfter: +e.target.value,
                          error: !!(editEntry.fuel > +e.target.value),
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
                          mt: "4px !important",
                        }}
                      >
                        Må være større enn før bunkring
                      </Typography>
                    )}
                  </>
                )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="outlined"
              sx={{
                borderColor: "primary.main",
                "&:hover": { borderColor: "primary.dark" },
              }}
              onClick={() => setEditEntry(undefined)}
            >
              Avbryt
            </Button>
            <Button
              sx={{ bgcolor: "fourth.main" }}
              variant="contained"
              onClick={() => {
                dispatch(
                  updateFuelMeasurement({
                    id: editEntry.id,
                    fuel: editEntry.fuel,
                    fuelAfter: editEntry.fuelAfter,
                    timestamp: editEntry.timestamp!.toISOString(),
                  }),
                );
                setEditEntry(undefined);
              }}
              disabled={
                !(
                  editEntry &&
                  editEntry.timestamp &&
                  isValidDate(editEntry.timestamp) &&
                  editEntry.fuel
                ) || editEntry.error
              }
            >
              Lagre
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};
