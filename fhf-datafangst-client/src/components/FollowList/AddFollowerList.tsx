import { FC, useMemo, useState } from "react";
import { InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { SearchVesselInfo } from "components";
import { Virtuoso } from "react-virtuoso";
import {
  selectUserFollowList,
  selectVesselsSorted,
  useAppSelector,
} from "store";
import theme from "app/theme";
import SearchIcon from "@mui/icons-material/Search";

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
      unfollowedVessels.filter(
        (vessel) => vessel.fiskeridir.name?.toLowerCase().includes(search),
      ),
    [unfollowedVessels, search],
  );

  return (
    <Paper
      sx={{
        borderRadius: 2,
        width: "100%",
        height: "100%",
        overflowY: "hidden",
      }}
    >
      <Typography variant="h3" sx={{ p: 3 }}>
        Legg til fartøy
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
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
