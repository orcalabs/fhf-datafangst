import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { fontStyle } from "app/theme";
import { VesselIcon } from "assets/icons";
import { AddFollowerList } from "components";
import { Vessel } from "generated/openapi";
import { useAuth } from "oidc-react";
import { FC } from "react";
import {
  selectGearGroupsMap,
  selectUserFollowList,
  updateUser,
  useAppDispatch,
  useAppSelector,
} from "store";
import { createGearListString, createOwnersListString } from "utils";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#DBE8EC",
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
        width: "100%",
        height: "100%",
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
        {!followList?.length ? (
          <Typography sx={{ px: 3, pb: 3 }}>
            Du følger ingen fartøy for øyeblikket
          </Typography>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 0 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell size="small" />
                  <StyledTableCell size="small">Navn</StyledTableCell>
                  <StyledTableCell size="small">Eier(e)</StyledTableCell>
                  <StyledTableCell size="small" align="right">
                    Redskap
                  </StyledTableCell>
                  <StyledTableCell size="small" align="right">
                    Lengde
                  </StyledTableCell>
                  <StyledTableCell size="small" align="right">
                    Kallesignal
                  </StyledTableCell>
                  <StyledTableCell size="small" align="right">
                    Reg.nr.
                  </StyledTableCell>
                  <StyledTableCell size="small" />
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
                        <VesselIcon />
                      </Avatar>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {f.fiskeridir.name}
                    </StyledTableCell>
                    <StyledTableCell>
                      {f.fiskeridir.owners.length ? (
                        createOwnersListString(f.fiskeridir.owners)
                      ) : (
                        <Typography
                          sx={{ fontStyle: "italic", fontSize: "15px" }}
                        >
                          Ukjent
                        </Typography>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {f.fiskeridir.owners ? (
                        createGearListString(
                          f.gearGroups.map((gg) => gearGroupsMap[gg]),
                        )
                      ) : (
                        <Typography
                          sx={{ fontStyle: "italic", fontSize: "15px" }}
                        >
                          Ukjent
                        </Typography>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {f.fiskeridir.length ? (
                        f.fiskeridir.length.toFixed(1)
                      ) : (
                        <Typography
                          sx={{ fontStyle: "italic", fontSize: "15px" }}
                        >
                          Ukjent
                        </Typography>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {f.fiskeridir.callSign ?? (
                        <Typography
                          sx={{ fontStyle: "italic", fontSize: "15px" }}
                        >
                          Ukjent
                        </Typography>
                      )}
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
      </Box>
      <Box
        sx={{
          gridColumnStart: 2,
          gridColumnEnd: 3,
          gridRowStart: 1,
          gridRowEnd: 2,
          height: "100%",
        }}
      >
        <AddFollowerList />
      </Box>
    </Box>
  );
};
