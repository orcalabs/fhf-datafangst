import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Paper,
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
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { nb } from "date-fns/locale";
import {
  ChangeEvent,
  FC,
  FocusEvent,
  forwardRef,
  useMemo,
  useState,
} from "react";
import { TableVirtuoso } from "react-virtuoso";
import {
  createFuelMeasurement,
  deleteFuelMeasurement,
  selectFuelMeasurements,
  updateFuelMeasurement,
  useAppDispatch,
  useAppSelector,
} from "store";
import { dateFormat } from "utils";

export const FuelPage: FC = () => {
  const dispatch = useAppDispatch();
  const _fuel = useAppSelector(selectFuelMeasurements);

  const [newDate, setNewDate] = useState<Date>(new Date());
  const [newFuel, setNewFuel] = useState<string>("");

  const fuel = useMemo(
    () => [{ timestamp: "", fuel: 0 }, ...(_fuel ?? [])],
    [_fuel],
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nb}>
      <TableVirtuoso
        style={{ height: "100%" }}
        components={TableComponents}
        data={fuel}
        fixedHeaderContent={() => (
          <StyledTableRow>
            <StyledTableCell sx={{ backgroundColor: "white" }}>
              Dato
            </StyledTableCell>
            <StyledTableCell sx={{ backgroundColor: "white" }} align="right">
              Måling
            </StyledTableCell>
            <StyledTableCell
              sx={{ backgroundColor: "white" }}
              align="right"
            ></StyledTableCell>
          </StyledTableRow>
        )}
        itemContent={(i, f) =>
          i === 0 ? (
            <>
              <StyledTableCell component="th" scope="row">
                <DateTimePicker
                  value={newDate}
                  onChange={(value) => value && setNewDate(value)}
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                <TextField
                  type="number"
                  variant="outlined"
                  value={newFuel}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setNewFuel(event.target.value)
                  }
                />
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <IconButton
                  color="success"
                  disabled={newFuel === "" || newDate === undefined}
                  onClick={() => {
                    dispatch(
                      createFuelMeasurement({
                        timestamp: newDate.toISOString(),
                        fuel: +newFuel,
                      }),
                    );
                    setNewFuel("");
                    setNewDate(new Date());
                  }}
                >
                  <CheckIcon />
                </IconButton>
              </StyledTableCell>
            </>
          ) : (
            <>
              <StyledTableCell component="th" scope="row">
                <Typography>
                  {dateFormat(f.timestamp, "dd.MM.yyyy HH:mm")}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="right" key={f.fuel}>
                <TextField
                  type="number"
                  variant="outlined"
                  defaultValue={f.fuel}
                  onBlur={(event: FocusEvent<HTMLInputElement>) => {
                    dispatch(
                      updateFuelMeasurement({
                        timestamp: f.timestamp,
                        fuel: +event.target.value,
                      }),
                    );
                  }}
                />
              </StyledTableCell>
              <StyledTableCell component="th" scope="row">
                <IconButton
                  onClick={() => {
                    dispatch(deleteFuelMeasurement({ timestamp: f.timestamp }));
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </>
          )
        }
      />
    </LocalizationProvider>
  );
};

const StyledTableRow = styled(TableRow)(() => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const TableComponents: any = {
  Scroller: forwardRef((props: any, ref: any) => (
    <TableContainer
      sx={{ maxWidth: "60rem", marginInline: "auto" }}
      component={Paper}
      ref={ref}
      {...props}
    />
  )),
  Table: (props: any) => (
    <Table {...props} style={{ borderCollapse: "separate" }} />
  ),
  TableHead,
  TableRow: StyledTableRow,
  TableBody: forwardRef((props: any, ref: any) => (
    <TableBody {...props} ref={ref} />
  )),
};
