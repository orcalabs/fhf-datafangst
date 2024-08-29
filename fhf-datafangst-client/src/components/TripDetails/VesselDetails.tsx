import {
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import theme from "app/theme";
import { FC } from "react";
import {
  selectSelectedTrip,
  selectVesselsByFiskeridirId,
  useAppSelector,
} from "store";

const StyledTableCell = styled(TableCell)(() => ({
  borderBottom: "none",
  color: "black",
  paddingLeft: 0,
  paddingRight: 0,
}));

export const VesselDetails: FC = () => {
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const vessels = useAppSelector(selectVesselsByFiskeridirId);
  const vessel = selectedTrip
    ? vessels[selectedTrip.fiskeridirVesselId]
    : undefined;

  return (
    <TableContainer sx={{ bgcolor: theme.palette.action.hover, p: 1 }}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <StyledTableCell>Trip ID.:</StyledTableCell>
            <StyledTableCell align="right">
              <Typography>{selectedTrip?.tripId}</Typography>
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>ID.:</StyledTableCell>
            <StyledTableCell align="right">
              <Typography>{vessel?.fiskeridir.id}</Typography>
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Kallesignal:</StyledTableCell>
            <StyledTableCell align="right">
              <Typography>{vessel?.fiskeridir.callSign}</Typography>
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Byggeår:</StyledTableCell>
            <StyledTableCell align="right">
              <Typography>{vessel?.fiskeridir.buildingYear}</Typography>
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Reg.nr.:</StyledTableCell>
            <StyledTableCell align="right">
              <Typography>{vessel?.fiskeridir.registrationId}</Typography>
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Lengde:</StyledTableCell>
            <StyledTableCell align="right">
              <Typography>
                {Number(vessel?.fiskeridir.length).toFixed(2)} m
              </Typography>
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>Bredde:</StyledTableCell>
            <StyledTableCell align="right">
              <Typography>
                {Number(vessel?.fiskeridir.width).toFixed(2)} m
              </Typography>
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
