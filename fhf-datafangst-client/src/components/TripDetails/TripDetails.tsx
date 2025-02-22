import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import {
  Box,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  styled,
  Table,
  TableContainer,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { OverlayScrollbars } from "components";
import { HEADER_HEIGHT } from "components/Layout/Header";
import { Landing } from "generated/openapi";
import { EventType } from "models";
import { FC, forwardRef } from "react";
import { TableComponents, TableVirtuoso } from "react-virtuoso";
import {
  selectLandings,
  selectSelectedTrip,
  setTripDetailsOpen,
  useAppDispatch,
  useAppSelector,
} from "store";
import { dateFormat } from "utils";
import { VesselDetails } from "./VesselDetails";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const VirtuosoTableComponents: TableComponents<Landing> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: TableHead as any,
  TableRow: (props) => <StyledTableRow {...props} />,
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

export const TripDetails: FC = () => {
  const dispatch = useAppDispatch();
  const trip = useAppSelector(selectSelectedTrip);
  const landings = useAppSelector(selectLandings);

  const fixedHeaderContent = () => {
    return (
      <TableRow>
        <StyledTableCell sx={{ width: 150 }} variant="head">
          Timestamp
        </StyledTableCell>
        <StyledTableCell variant="head">Catch Location</StyledTableCell>
        {/* <StyledTableCell>Catches</StyledTableCell> */}
        <StyledTableCell variant="head">Delivery Point ID</StyledTableCell>
        <StyledTableCell variant="head">Vessel ID</StyledTableCell>
        <StyledTableCell variant="head">Gear Group ID</StyledTableCell>
        <StyledTableCell variant="head">Gear ID</StyledTableCell>
        <StyledTableCell sx={{ width: 130 }} variant="head">
          Landing ID
        </StyledTableCell>
        <StyledTableCell variant="head">Gross Weight</StyledTableCell>
        <StyledTableCell variant="head">Living Weight</StyledTableCell>
        <StyledTableCell variant="head">Product Weight</StyledTableCell>
        <StyledTableCell variant="head">Call Sign</StyledTableCell>
        <StyledTableCell variant="head">Length</StyledTableCell>
        <StyledTableCell variant="head">Length Group</StyledTableCell>
        <StyledTableCell variant="head">Name</StyledTableCell>
      </TableRow>
    );
  };

  const rowContent = (_index: number, l: Landing) => {
    return (
      <>
        <StyledTableCell sx={{ width: 150 }}>
          {dateFormat(l.landingTimestamp, "dd.MM.yyyy HH:mm")}
        </StyledTableCell>
        <StyledTableCell>{l.catchLocation}</StyledTableCell>
        {/* <StyledTableCell>{l.catches}</StyledTableCell> */}
        <StyledTableCell>{l.deliveryPointId}</StyledTableCell>
        <StyledTableCell>{l.fiskeridirVesselId}</StyledTableCell>
        <StyledTableCell>{l.gearGroupId}</StyledTableCell>
        <StyledTableCell>{l.gearId}</StyledTableCell>
        <StyledTableCell sx={{ width: 130 }}>{l.id}</StyledTableCell>
        <StyledTableCell>{l.totalGrossWeight.toFixed(2)}</StyledTableCell>
        <StyledTableCell>{l.totalLivingWeight.toFixed(2)}</StyledTableCell>
        <StyledTableCell>{l.totalProductWeight.toFixed(2)}</StyledTableCell>
        <StyledTableCell>{l.vesselCallSign}</StyledTableCell>
        <StyledTableCell>{l.vesselLength?.toFixed(2)}</StyledTableCell>
        <StyledTableCell>{l.vesselLengthGroup}</StyledTableCell>
        <StyledTableCell>{l.vesselName}</StyledTableCell>
      </>
    );
  };

  return (
    <OverlayScrollbars
      style={{
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        backgroundColor: "white",
      }}
    >
      <Box display="flex" justifyContent={"space-between"} sx={{ p: 2 }}>
        <Box sx={{ width: 350 }}>
          <VesselDetails vesselId={trip?.fiskeridirVesselId} />
        </Box>
        <IconButton
          sx={{ width: 40, height: 40 }}
          onClick={() => dispatch(setTripDetailsOpen(false))}
        >
          <ClearSharpIcon sx={{ color: "black" }} />
        </IconButton>
      </Box>
      <Box sx={{ height: "40%", width: "100%" }}>
        <TableVirtuoso
          data={landings}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Box>
      <Box
        sx={{
          border: "1px solid #3E7B74",
          overflowY: "auto",
          bgcolor: "action.hover",
          p: 2,
          mt: 2,
          height: "40%",
          "& .MuiStepLabel-labelContainer": { color: "black" },
          "& .MuiStepConnector-root": { ml: "17px" },
        }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ my: "auto", pb: 2 }}>
          Logg
        </Typography>
        <Stepper orientation="vertical" nonLinear>
          {trip?.events.map((event) => (
            <Step key={event.eventId}>
              <StepLabel
                icon={EventType[event.eventType]}
                slotProps={{
                  stepIcon: {
                    active: true,
                    sx: {
                      width: 35,
                      height: 35,
                      "& .MuiStepIcon-text": { fontSize: "0.6rem" },
                    },
                  },
                }}
              >
                <Typography>
                  Reported:{" "}
                  {dateFormat(event.reportTimestamp, "dd.MM.yyyy HH:mm")}
                </Typography>
                <Typography>
                  Occurrence:{" "}
                  {dateFormat(event.occurenceTimestamp, "dd.MM.yyyy HH:mm")}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </OverlayScrollbars>
  );
};
