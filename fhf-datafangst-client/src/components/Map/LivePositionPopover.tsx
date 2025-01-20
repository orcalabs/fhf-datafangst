import {
  Box,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { VesselIcon } from "assets/icons";
import { CurrentAisPosition } from "generated/openapi";
import { FC, useEffect } from "react";
import {
  getVessels,
  selectVesselByMmsi,
  useAppDispatch,
  useAppSelector,
} from "store";
import { dateFormat } from "utils";

interface Props {
  position: CurrentAisPosition;
}

const StyledTableCell = styled(TableCell)(() => ({
  border: 0,
  paddingTop: 3,
  paddingBottom: 3,
}));

export const LivePositionPopover: FC<Props> = ({ position }) => {
  const dispatch = useAppDispatch();

  const vessel = useAppSelector((state) =>
    selectVesselByMmsi(state, position.mmsi),
  );

  useEffect(() => {
    if (!vessel) {
      dispatch(getVessels());
    }
  }, [vessel]);

  if (!vessel) {
    return <></>;
  }

  return (
    <Box sx={{ minWidth: 300 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1,
          bgcolor: "fourth.dark",
          color: "white",
        }}
      >
        <Typography
          sx={{ alignSelf: "center" }}
          variant="h6"
          align="center"
          fontWeight="bold"
        >
          {vessel.fiskeridir.name ?? vessel.ais?.name ?? "Ukjent"}
        </Typography>
        <VesselIcon fill="white" width="36" height="36" />
      </Stack>
      <Box sx={{ py: 2 }}>
        <Table size="small">
          <TableBody>
            {row(
              "Fart:",
              Number.isFinite(position.speedOverGround)
                ? position.speedOverGround!.toFixed(1) + " knop"
                : "Ukjent",
            )}
            {row(
              "Kurs:",
              Number.isFinite(position.cog)
                ? position.cog!.toFixed(2) + "°"
                : "Ukjent",
            )}
            {row(
              "Posisjon mottatt:",
              dateFormat(position.timestamp, "d MMM p"),
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

const row = (title: string, value?: string) => (
  <TableRow>
    <StyledTableCell sx={{ color: "primary.main" }}>{title}</StyledTableCell>
    <StyledTableCell>
      <Typography>{value}</Typography>
    </StyledTableCell>
  </TableRow>
);
