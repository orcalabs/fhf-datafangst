import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import { FC } from "react";
import {
  selectBwUserProfile,
  selectVesselsByCallsign,
  useAppSelector,
} from "store";
import { toTitleCase } from "utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DirectionsBoatSharpIcon from "@mui/icons-material/DirectionsBoatSharp";
import theme from "app/theme";

const StyledTableCell = styled(TableCell)(() => ({
  borderBottom: "none",
  color: "white",
  paddingLeft: 0,
  paddingRight: 0,
}));

export const VesselInfo: FC = () => {
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;

  if (!profile?.vesselInfo) {
    return (
      <Typography variant="h6" sx={{ px: 4, pt: 3 }}>
        Du har ingen registrerte fartøy
      </Typography>
    );
  }

  return (
    <Accordion disableGutters square elevation={0}>
      <AccordionSummary
        sx={{
          color: "white",
          bgcolor: "primary.main",
          pl: 2.5,
          pr: 2,
        }}
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", pt: 3, color: "white" }}>
            <Box>
              <DirectionsBoatSharpIcon
                fill={theme.palette.secondary.main}
                width="36"
                height="36"
              />
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography variant="h5" color="white">
                {vessel?.fiskeridir.name ?? "Ukjent"}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h6"
                sx={{
                  fontSize: "1rem",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {vessel?.fiskeridir.owner
                  ? toTitleCase(vessel.fiskeridir.owner)
                  : "Ukjent eier"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ bgcolor: "primary.main", pb: 0, px: 4 }}>
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow>
                <StyledTableCell sx={{ color: "text.secondary" }}>
                  Reg.nr.:
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Typography>
                    {vessel?.fiskeridir.registrationId ?? "Ukjent"}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell sx={{ color: "text.secondary" }}>
                  Lengde:
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Typography>
                    {vessel
                      ? Number(vessel?.fiskeridir.length).toFixed(1)
                      : "Ukjent"}{" "}
                    m
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell sx={{ color: "text.secondary" }}>
                  Bredde:
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Typography>
                    {vessel
                      ? Number(vessel.fiskeridir.width).toFixed(1)
                      : "Ukjent"}{" "}
                    m
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell sx={{ color: "text.secondary" }}>
                  Redskap:
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Typography>Ukjent</Typography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};
