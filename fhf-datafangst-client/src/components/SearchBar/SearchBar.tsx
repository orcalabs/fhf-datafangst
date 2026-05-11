import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import theme from "~/app/theme";
import { VesselIcon } from "~/assets/icons";
import { StyledPopper, VirtualAutocomplete } from "~/components";
import type { Vessel } from "~/generated/openapi";
import { useFishmapContext } from "~/hooks";
import {
  selectCurrentPositionsMap,
  selectVesselsByFiskeridirId,
  useAppSelector,
} from "~/store";
import { fromLonLat, toTitleCase } from "~/utils";

export const SearchBar: FC = () => {
  const [_, setParams] = useSearchParams();

  const { map } = useFishmapContext();

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
      <VirtualAutocomplete
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
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(event) => setInputValue(event.target.value)}
            variant={"outlined"}
            placeholder={"Søk etter fartøy"}
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              },
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
          </li>,
        ]}
      />
    </Box>
  );
};
