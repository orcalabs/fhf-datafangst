import {
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import theme from "~/app/theme";
import {
  selectSelectedTrip,
  selectVesselByFiskeridirId,
  useAppSelector,
} from "~/store";

const StyledTableCell = styled(TableCell)(() => ({
  borderBottom: "none",
  color: "black",
  paddingLeft: 0,
  paddingRight: 0,
}));

export interface Props {
  vesselId?: number;
}

export const VesselDetails: FC<Props> = ({ vesselId }) => {
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const vessel = useAppSelector((state) =>
    selectVesselByFiskeridirId(state, vesselId),
  );

  return (
    <TableContainer sx={{ bgcolor: theme.palette.action.hover, p: 1 }}>
      <Table size="small">
        <TableBody>
          {selectedTrip && (
            <TableRow>
              <StyledTableCell>Trip ID.:</StyledTableCell>
              <StyledTableCell align="right">
                <Typography>{selectedTrip.tripId}</Typography>
              </StyledTableCell>
            </TableRow>
          )}
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
