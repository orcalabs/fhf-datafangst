import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import theme from "app/theme";
import { ListboxComponent, StyledPopper } from "components";
import { Vessel } from "generated/openapi";
import { FC, memo } from "react";
import {
  MenuViewState,
  selectVesselsSorted,
  selectViewState,
  useAppSelector,
} from "store";
import { toTitleCase } from "utils";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

interface Props {
  value?: Vessel[];
  onChange: (vessel?: Vessel[]) => void;
  useVirtualization?: boolean;
}

export const VesselFilter: FC<Props> = (props) => {
  const viewState = useAppSelector(selectViewState);
  const vessels = useAppSelector(selectVesselsSorted);

  return (
    <VesselFilterInner props={props} viewState={viewState} vessels={vessels} />
  );
};

interface PropsInner {
  props: Props;
  viewState: MenuViewState;
  vessels: Vessel[];
}

const VesselFilterInner = memo(
  function VesselFilterInner({ props, viewState, vessels }: PropsInner) {
    const { value, onChange, useVirtualization } = props;

    return (
      <>
        <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
          {viewState !== MenuViewState.MyPage
            ? "Fartøy"
            : "Finn fartøy å følge"}
        </Typography>
        <Autocomplete
          sx={{
            "& .MuiButtonBase-root": {
              borderRadius: 0,

              "&:hover": {
                borderRadius: 0,
              },
            },
            "& .MuiAutocomplete-inputRoot": {
              color:
                viewState === MenuViewState.Overview ||
                viewState === MenuViewState.MyPage
                  ? "white"
                  : "black",
            },
            "& .MuiInputBase-root": { pb: "6px" },
            "& .MuiChip-filled": {
              color: "black",
              bgcolor: "secondary.main",
              borderRadius: 0,
            },
          }}
          size="small"
          multiple
          limitTags={3}
          ChipProps={{ deleteIcon: <DisabledByDefaultIcon /> }}
          PopperComponent={StyledPopper}
          ListboxComponent={useVirtualization ? ListboxComponent : undefined}
          disablePortal
          disableListWrap
          onKeyDown={(e) => e.stopPropagation()}
          value={value ?? []}
          onChange={(_: any, vessels: Vessel[] | null) =>
            onChange(vessels?.length ? vessels : undefined)
          }
          options={vessels}
          getOptionLabel={(option: Vessel) =>
            toTitleCase(option?.fiskeridir?.name ?? "Ukjent")
          }
          renderInput={(params: any) => (
            <TextField
              {...params}
              variant={
                viewState === MenuViewState.Overview ||
                viewState === MenuViewState.MyPage
                  ? "standard"
                  : "outlined"
              }
              placeholder={
                value ?? viewState !== MenuViewState.Overview
                  ? ""
                  : "Søk etter fartøy"
              }
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
                  <DirectionsBoatIcon
                    fill={theme.palette.primary.light}
                    width="30"
                    height="30"
                  />
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" noWrap sx={{ width: 210 }}>
                    {toTitleCase(option?.fiskeridir.name ?? "Ukjent")}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {option.fiskeridir.registrationId}
                  </Typography>
                </Box>
              </Box>
            </li>
          )}
        />
      </>
    );
  },
  (prev, next) =>
    prev.props.value === next.props.value &&
    prev.viewState === next.viewState &&
    prev.vessels === next.vessels,
);
