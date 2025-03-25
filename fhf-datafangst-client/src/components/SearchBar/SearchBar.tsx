import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import theme from "app/theme";
import { VesselIcon } from "assets/icons";
import { ListboxComponent, StyledPopper } from "components/Common/Common";
import { Vessel } from "generated/openapi";
import { FC, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  selectCurrentPositionsMap,
  selectFishmap,
  selectVesselsByFiskeridirId,
  useAppSelector,
} from "store";
import { fromLonLat, toTitleCase } from "utils";

export const SearchBar: FC = () => {
  const [_, setParams] = useSearchParams();
  const map = useAppSelector(selectFishmap);
  const vesselsMap = useAppSelector(selectVesselsByFiskeridirId);
  const currentPositionsMap = useAppSelector(selectCurrentPositionsMap);

  const [inputValue, setInputValue] = useState<string>("");

  const vessels = useMemo(
    () =>
      Object.values(vesselsMap)
        .filter((vessel) => vessel.fiskeridir.id in currentPositionsMap)
        .sort((a, b) =>
          (a.fiskeridir?.name ?? "Ukjent").localeCompare(
            b.fiskeridir?.name ?? "Ukjent",
            "no",
          ),
        ),
    [vesselsMap, currentPositionsMap],
  );

  return (
    <Box
      sx={{
        pr: 2,
        pt: 2,
        backgroundColor: "transparent",
        color: "white",
        "& .MuiIconButton-root": {
          color: "text.secondary",
          borderRadius: 0,
          "&:hover": { borderRadius: 0 },
        },
        "& .MuiAutocomplete-root .MuiOutlinedInput-root": {
          width: 370,
          bgcolor: "white",
          color: "black",
          zIndex: 1200,
          borderRadius: 0,
          py: 1,
        },
      }}
    >
      <Autocomplete
        sx={{
          "& .MuiAutocomplete-inputRoot": { color: "white", height: 56 },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "primary.dark" },
        }}
        value={null}
        inputValue={inputValue}
        disableListWrap
        options={vessels}
        noOptionsText={"Ingen fartøy funnet"}
        getOptionLabel={(option: Vessel) =>
          option.fiskeridir.name ? option.fiskeridir.name : "Ukjent"
        }
        slotProps={{
          listbox: {
            component: ListboxComponent,
          },
        }}
        slots={{
          popper: StyledPopper,
        }}
        onChange={(_: any, value: Vessel | null) => {
          setInputValue("");
          if (value) {
            const liveVessel = currentPositionsMap?.[value.fiskeridir.id];

            if (liveVessel) {
              const callSign =
                vesselsMap?.[liveVessel.vesselId].fiskeridir.callSign;

              if (callSign) {
                setParams(new URLSearchParams({ callSign }));
              }
              // Set map center to selected vessel
              map
                .getView()
                .setCenter(fromLonLat(liveVessel.lon, liveVessel.lat));
            }
          }
        }}
        renderInput={(params: any) => (
          <TextField
            {...params}
            onChange={(event) => setInputValue(event.target.value)}
            variant={"outlined"}
            placeholder={"Søk etter fartøy"}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        renderOption={(props: any, option: Vessel) => (
          <li
            {...props}
            key={option.fiskeridir.id}
            title={
              option.fiskeridir.name && option.fiskeridir.name.length > 31
                ? option.fiskeridir.name
                : undefined
            }
          >
            <Box sx={{ display: "flex" }}>
              <Box
                sx={{
                  m: "auto",
                  display: "flex",
                  justifyContent: "center",
                  color: "secondary.main",
                }}
              >
                <VesselIcon
                  fill={theme.palette.primary.light}
                  width="30"
                  height="30"
                />
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" noWrap sx={{ width: 210 }}>
                  {option.fiskeridir.name
                    ? toTitleCase(option.fiskeridir.name)
                    : ""}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {option.fiskeridir.callSign ?? "Ukjent"}
                </Typography>
              </Box>
            </Box>
          </li>
        )}
      />
    </Box>
  );
};
