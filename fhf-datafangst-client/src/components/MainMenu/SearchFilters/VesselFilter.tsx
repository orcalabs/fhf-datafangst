import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import theme from "app/theme";
import { ListboxComponent, StyledPopper } from "components";
import { Vessel } from "generated/openapi";
import { FC, useMemo } from "react";
import { selectVesselsByFiskeridirId, useAppSelector } from "store";
import { toTitleCase } from "utils";
import DirectionsBoatSharpIcon from "@mui/icons-material/DirectionsBoatSharp";

interface Props {
  value?: Vessel;
  onChange: (vessel?: Vessel) => void;
  useVirtualization?: boolean;
}

export const VesselFilter: FC<Props> = (props) => {
  const { value, onChange, useVirtualization } = props;
  const vesselsMap = useAppSelector(selectVesselsByFiskeridirId);
  const vessels = Object.values(vesselsMap);

  const options = useMemo(
    () =>
      vessels.sort((a, b) =>
        (a.fiskeridir.name ?? "Ukjent").localeCompare(
          b.fiskeridir.name ?? "Ukjent",
          "no",
        ),
      ),
    [vessels],
  );

  return (
    <>
      <Typography sx={{ pb: 1, pt: 2 }} fontWeight="bold">
        Fartøy
      </Typography>
      <Autocomplete
        sx={{
          "& .MuiButtonBase-root": {
            borderRadius: 0,

            "&:hover": {
              borderRadius: 0,
            },
          },
        }}
        size="small"
        PopperComponent={StyledPopper}
        ListboxComponent={useVirtualization ? ListboxComponent : undefined}
        disablePortal
        disableListWrap
        onKeyDown={(e) => e.stopPropagation()}
        value={value ?? null}
        onChange={(_: any, vessel: Vessel | null) =>
          onChange(vessel ?? undefined)
        }
        options={options}
        getOptionLabel={(option: Vessel) =>
          toTitleCase(option?.fiskeridir.name ?? "Ukjent")
        }
        renderInput={(params: any) => <TextField {...params} />}
        renderOption={(props: any, option: any) => (
          <li
            {...props}
            key={option.id}
            title={option.name.length > 31 ? option.name : undefined}
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
                <DirectionsBoatSharpIcon
                  fill={theme.palette.primary.light}
                  width="30"
                  height="30"
                />
              </Box>
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" noWrap sx={{ width: 210 }}>
                  {toTitleCase(option?.name ?? "Ukjent")}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {option.registrationId}
                </Typography>
              </Box>
            </Box>
          </li>
        )}
      />
    </>
  );
};
