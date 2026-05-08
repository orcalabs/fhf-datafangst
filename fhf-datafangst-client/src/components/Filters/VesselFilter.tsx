import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { Box, TextField, Typography } from "@mui/material";
import type { FC } from "react";
import { memo } from "react";
import theme from "~/app/theme";
import { StyledPopper, VirtualAutocomplete } from "~/components";
import type { Vessel } from "~/generated/openapi";
import { AppPage } from "~/models";
import { selectAppPage, selectVesselsSorted, useAppSelector } from "~/store";
import { toTitleCase } from "~/utils";

interface Props {
  value?: Vessel[];
  onChange: (vessel?: Vessel[]) => void;
}

export const VesselFilter: FC<Props> = (props) => {
  const viewState = useAppSelector(selectAppPage);
  const vessels = useAppSelector(selectVesselsSorted);

  return (
    <VesselFilterInner props={props} appPage={viewState!} vessels={vessels} />
  );
};

interface PropsInner {
  props: Props;
  appPage: AppPage;
  vessels: Vessel[];
}

const VesselFilterInner = memo(
  function VesselFilterInner({ props, appPage, vessels }: PropsInner) {
    const { value, onChange } = props;

    return (
      <>
        <Typography sx={{ pb: 1, pt: 2, fontWeight: "bold" }}>
          Fartøy
        </Typography>
        <VirtualAutocomplete
          sx={{
            "& .MuiButtonBase-root": {
              borderRadius: 0,

              "&:hover": {
                borderRadius: 0,
              },
            },
            "& .MuiAutocomplete-inputRoot": {
              color: appPage === AppPage.Area ? "white" : "black",
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
              variant={appPage === AppPage.Area ? "standard" : "outlined"}
              placeholder={
                (value ?? appPage !== AppPage.Area) ? "" : "Søk etter fartøy"
              }
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
                    {option.fiskeridir.callSign ?? "Ukjent kallesignal"}
                  </Typography>
                </Box>
              </Box>
            </li>,
          ]}
          slots={{
            popper: StyledPopper,
          }}
          slotProps={{
            chip: { deleteIcon: <DisabledByDefaultIcon /> },
          }}
        />
      </>
    );
  },
  (prev, next) =>
    prev.props.value === next.props.value &&
    prev.appPage === next.appPage &&
    prev.vessels === next.vessels &&
    prev.props.onChange === next.props.onChange,
);
