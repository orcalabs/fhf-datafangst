import { PersonAdd } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import theme from "app/theme";
import { Vessel } from "generated/openapi";
import { FC } from "react";
import {
  selectUserFollowList,
  updateUser,
  useAppDispatch,
  useAppSelector,
} from "store";
import { createOwnersListString } from "utils";

const StyledTableCell = styled(TableCell)(() => ({
  borderBottom: "none",
  padding: 1,
}));

interface Props {
  vessel: Vessel;
}

export const SearchVesselInfo: FC<Props> = ({ vessel }) => {
  const dispatch = useAppDispatch();

  const followList = useAppSelector(selectUserFollowList);

  const handleAddUser = () => {
    const following = followList ?? [];
    dispatch(updateUser({ following: [...following, vessel] }));
  };

  return (
    <Accordion
      disableGutters
      square
      sx={{
        "&:hover": { bgcolor: theme.palette.grey[400] },
      }}
    >
      <AccordionSummary
        sx={{
          px: 3,
          pt: 1,
          "& .MuiAccordionSummary-content": {
            mt: 0,
          },
          flexDirection: "row-reverse",
          alignItems: "flex-start",
          "& .MuiAccordionSummary-expandIconWrapper": {
            mt: 1,
          },
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", ml: 2, pt: 1 }}>
            <Typography variant="h5" color="primary.light">
              {vessel?.fiskeridir.name ?? "Ukjent"}
            </Typography>
            <Typography
              color={theme.palette.grey[700]}
              variant="h6"
              sx={{
                fontSize: "1rem",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {vessel?.fiskeridir.owners.length
                ? createOwnersListString(vessel.fiskeridir.owners)
                : "Ukjent eier"}
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              border: "1px solid green",
              width: 85,
              height: 36,
              borderRadius: "4px",
              "&:hover": { bgcolor: "#ACD9B8", cursor: "pointer" },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddUser();
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                lineHeight: "1.75",
                color: "primary.main",
              }}
            >
              Følg
            </Typography>
            <PersonAdd sx={{ color: "green", fontSize: "1.2rem", ml: 1 }} />
          </Stack>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pl: 8 }}>
        <TableContainer sx={{ mx: 0, width: 400 }}>
          <Table size="small">
            <TableBody>
              <TableRow>
                <StyledTableCell sx={{ color: theme.palette.grey[700] }}>
                  Kallesignal:
                </StyledTableCell>
                <StyledTableCell>
                  <Typography>
                    {vessel?.fiskeridir.callSign ?? "Ukjent"}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell sx={{ color: theme.palette.grey[700] }}>
                  Reg.nr.:
                </StyledTableCell>
                <StyledTableCell>
                  <Typography>
                    {vessel?.fiskeridir.registrationId ?? "Ukjent"}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell sx={{ color: theme.palette.grey[700] }}>
                  Lengde:
                </StyledTableCell>
                <StyledTableCell>
                  <Typography>
                    {vessel?.fiskeridir.length
                      ? Number(vessel.fiskeridir.length).toFixed(1) + " m"
                      : "Ukjent"}
                  </Typography>
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell sx={{ color: theme.palette.grey[700] }}>
                  Redskap:
                </StyledTableCell>
                <StyledTableCell>
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
