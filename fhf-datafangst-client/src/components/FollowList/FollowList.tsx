import { FC } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import DirectionsBoatSharpIcon from "@mui/icons-material/DirectionsBoatSharp";
import { fontStyle } from "app/theme";
import {
  selectGearGroupsMap,
  selectUserFollowList,
  updateUser,
  useAppDispatch,
  useAppSelector,
} from "store";
import { createGearListString, createOwnersListString } from "utils";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddFollowerList } from "components";
import { Vessel } from "generated/openapi";
import { useAuth } from "oidc-react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.text.secondary,
    color: "black",
    fontWeight: fontStyle.fontWeightSemiBold,
    fontSize: 15,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  height: 80,
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const FollowList: FC = () => {
  const dispatch = useAppDispatch();
  const gearGroupsMap = useAppSelector(selectGearGroupsMap);
  const { userData } = useAuth();
  const followList = useAppSelector(selectUserFollowList);

  const handleDeleteFollow = (vessel: Vessel) => {
    dispatch(
      updateUser({
        following:
          followList?.filter((f) => f.fiskeridir.id !== vessel.fiskeridir.id) ??
          [],
        accessToken: userData?.access_token,
      }),
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 550px",
        gridTemplateRows: "1fr",
        columnGap: 8,
        p: 3,
        width: "100%",
      }}
    >
      <Box
        sx={{
          gridColumnStart: 1,
          gridColumnEnd: 2,
          gridRowStart: 1,
          gridRowEnd: 2,
        }}
      >
        <Paper sx={{ borderRadius: 2, width: "100%", pb: 1 }}>
          <Typography variant="h3" sx={{ p: 3 }}>
            Følgeliste
          </Typography>
          {!followList?.length ? (
            <Typography sx={{ px: 3, pb: 3 }}>
              Du følger ingen fartøy for øyeblikket
            </Typography>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 0 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell />
                    <StyledTableCell>Navn</StyledTableCell>
                    <StyledTableCell>Eier(e)</StyledTableCell>
                    <StyledTableCell align="right">Redskap</StyledTableCell>
                    <StyledTableCell align="right">Lengde</StyledTableCell>
                    <StyledTableCell align="right">Kallesignal</StyledTableCell>
                    <StyledTableCell align="right">Reg.nr.</StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {followList.map((f) => (
                    <StyledTableRow key={f.fiskeridir.id}>
                      <StyledTableCell component="th" scope="row" width="35">
                        <Avatar
                          sx={{
                            bgcolor: "secondary.main",
                            width: 35,
                            height: 35,
                          }}
                        >
                          <DirectionsBoatSharpIcon fontSize="small" />
                        </Avatar>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {f.fiskeridir.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        {f.fiskeridir.owners
                          ? createOwnersListString(f.fiskeridir.owners)
                          : "Ukjent eier"}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {f.fiskeridir.owners
                          ? createGearListString(
                              f.gearGroups.map((gg) => gearGroupsMap[gg]),
                            )
                          : "Ukjent redskap"}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {f.fiskeridir.length?.toFixed(1)}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {f.fiskeridir.callSign}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {f.fiskeridir.registrationId}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <IconButton
                          sx={{ float: "right" }}
                          onClick={() => {
                            handleDeleteFollow(f);
                          }}
                        >
                          <DeleteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
      <Box
        sx={{
          gridColumnStart: 2,
          gridColumnEnd: 3,
          gridRowStart: 1,
          gridRowEnd: 2,
        }}
      >
        <AddFollowerList />
      </Box>
    </Box>
  );
};
