import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, Paper, TextField, Typography } from "@mui/material";
import theme, { fontStyle } from "app/theme";
import { SearchVesselInfo } from "components";
import { FC, useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import {
  selectUserFollowList,
  selectVesselsSorted,
  useAppSelector,
} from "store";

export const AddFollowerList: FC = () => {
  const vessels = useAppSelector(selectVesselsSorted);
  const [search, setSearch] = useState<string>("");
  const followList = useAppSelector(selectUserFollowList);

  const unfollowedVessels = useMemo(
    () => vessels.filter((vessel) => !followList?.includes(vessel)),
    [followList, vessels],
  );

  const filteredVessels = useMemo(
    () =>
      unfollowedVessels.filter((vessel) =>
        vessel.fiskeridir.name?.toLowerCase().includes(search),
      ),
    [unfollowedVessels, search],
  );

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 2,
        width: "100%",
        height: "100%",
        overflowY: "hidden",
      }}
    >
      <Typography
        sx={{ p: 3, fontSize: "1.6rem", fontWeight: fontStyle.fontWeightBold }}
      >
        Finn fartøy
      </Typography>
      <TextField
        sx={{
          width: "100%",
          px: 3,
          mb: 1,
          "& .MuiOutlinedInput-root": {
            bgcolor: theme.palette.grey[100],
          },
          "& .MuiFormLabel-root": {
            color: "black",
          },
        }}
        placeholder="Søk"
        variant="outlined"
        onChange={(event) => setSearch(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      {filteredVessels.length ? (
        <Virtuoso
          totalCount={filteredVessels.length}
          itemContent={(index) => {
            const vessel = filteredVessels[index];
            return <SearchVesselInfo vessel={vessel} />;
          }}
        />
      ) : (
        <Typography sx={{ px: 3, pt: 2 }}>Ingen fartøy funnet</Typography>
      )}
    </Paper>
  );
};
