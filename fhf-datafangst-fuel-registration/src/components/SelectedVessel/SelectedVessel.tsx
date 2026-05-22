import {
  Box,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SxProps,
} from "@mui/material";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { LocalLoadingProgress, VirtualAutocomplete } from "~/components";
import {
  selectFisheryVessels,
  selectIsProjectUser,
  selectSelectedCallSign,
  selectVesselsByCallsign,
  selectVesselsSorted,
  updateUser,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { toTitleCase } from "~/utils";

export const SelectedVessel = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const _vessels = useAppSelector(selectVesselsSorted);
  const vesselsMap = useAppSelector(selectVesselsByCallsign);
  const callSign = useAppSelector(selectSelectedCallSign);
  const fisheryVessels = useAppSelector(selectFisheryVessels);
  const isProjectUser = useAppSelector(selectIsProjectUser);

  const vessels = useMemo(
    () => _vessels?.filter((v) => !!v.fiskeridir.callSign),
    [_vessels],
  );

  const vessel = callSign ? vesselsMap?.[callSign] : undefined;

  if (!vessels || !vesselsMap || !callSign || !vessel) {
    return <LocalLoadingProgress size={20} />;
  }

  return isProjectUser ? (
    <VirtualAutocomplete
      disableListWrap
      disableClearable
      value={vessel}
      options={vessels}
      noOptionsText="Ingen fartøy funnet"
      getOptionLabel={(option) => option.fiskeridir.name ?? "Ukjent"}
      sx={sx}
      onChange={(_, value) => {
        localStorage.setItem("callSignOverride", value.fiskeridir.callSign!);
        navigate(0);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            "& .MuiInputBase-root": { padding: 0 },
          }}
        />
      )}
      optionKey={(v) => v.fiskeridir.id}
      renderOption={(props, option) => [
        option,
        <li
          {...props}
          key={option.fiskeridir.id}
          title={
            option.fiskeridir.name && option.fiskeridir.name.length > 31
              ? option.fiskeridir.name
              : undefined
          }
        >
          <Box>
            <Typography variant="body2" noWrap sx={{ width: 210 }}>
              {toTitleCase(option.fiskeridir.name ?? "Ukjent")}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {option.fiskeridir.callSign}
            </Typography>
          </Box>
        </li>,
      ]}
    />
  ) : (
    <Select
      value={callSign}
      renderValue={(cs) => {
        const v = vesselsMap[cs];
        return v ? toTitleCase(v.fiskeridir.name ?? "Ukjent") : "Ukjent";
      }}
      sx={sx}
      onChange={(e) => {
        dispatch(updateUser({ selectedVessel: e.target.value })).then(() =>
          navigate(0),
        );
      }}
    >
      {fisheryVessels.map((v) => (
        <MenuItem key={v.fiskeridir.id} value={v.fiskeridir.callSign!}>
          <Box>
            <Typography variant="body2" noWrap sx={{ width: 210 }}>
              {toTitleCase(v.fiskeridir.name ?? "Ukjent")}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {v.fiskeridir.callSign}
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
};

const sx: SxProps = {
  width: 150,
  height: "100%",
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
};
