import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, Button, Popper } from "@mui/material";
import { TripsArgs } from "api";
import {
  DateFilter,
  GearFilter,
  SortingFilter,
  SpeciesFilter,
  VesselLengthFilter,
  WeightFilter,
} from "components";
import { VesselFilter } from "components/Filters/VesselFilter";
import { FC, useRef } from "react";
import {
  selectTripFiltersOpen,
  setTripFiltersOpen,
  useAppDispatch,
  useAppSelector,
} from "store";

export type SearchParams = Partial<
  Pick<
    TripsArgs,
    | "vessels"
    | "dateRange"
    | "speciesGroups"
    | "gearGroups"
    | "vesselLengthGroups"
    | "weight"
    | "sorting"
  >
>;

interface Props {
  params: SearchParams;
  onChange: (_: any) => void;
}

export const SearchFilters: FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const filtersAnchor = useAppSelector(selectTripFiltersOpen);
  const filterButtonRef = useRef(null);

  const handleFilterClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(setTripFiltersOpen(!filtersAnchor));
  };

  const handleChange = (param: SearchParams) =>
    props.onChange({ ...props.params, ...param });

  const renderParam = (key: keyof SearchParams) => {
    const onChange = (value: SearchParams[typeof key]) =>
      handleChange({ [key]: value });

    switch (key) {
      case "vessels":
        return (
          <VesselFilter
            value={props.params[key]}
            onChange={onChange}
            useVirtualization={true}
          />
        );
      case "dateRange":
        return (
          <DateFilter
            value={props.params[key]}
            onChange={onChange}
            validateRange
          />
        );
      case "speciesGroups":
        return (
          <SpeciesFilter
            value={props.params[key]}
            options={props.params.vessels?.flatMap((v) => v.speciesGroups)}
            onChange={onChange}
          />
        );
      case "gearGroups":
        return (
          <GearFilter
            value={props.params[key]}
            options={props.params.vessels?.flatMap((v) => v.gearGroups)}
            onChange={onChange}
          />
        );
      case "vesselLengthGroups":
        return (
          <VesselLengthFilter
            value={props.params[key]}
            options={props.params.vessels?.map(
              (v) => v.fiskeridir.lengthGroupId,
            )}
            onChange={onChange}
          />
        );
      case "weight":
        return <WeightFilter value={props.params[key]} onChange={onChange} />;
      case "sorting":
        return <SortingFilter value={props.params[key]} onChange={onChange} />;
    }
  };

  return (
    <>
      <Box
        sx={{
          "& .MuiButton-root": {
            borderRadius: 0,
            border: 0,
            padding: "5px 10px",
            borderColor: "primary.dark",
            "&:hover": { bgcolor: "primary.main", border: 0 },
            bgcolor: filtersAnchor ? "primary.main" : "inherit",
            "& .MuiButton-startIcon": {
              marginRight: 0,
            },
            "& .MuiButton-endIcon": {
              paddingTop: "4px",
            },
          },
        }}
      >
        <Button
          ref={filterButtonRef}
          sx={[
            { color: "white" },
            !!filtersAnchor && {
              "& .MuiButton-endIcon": {
                transform: "scaleX(-1)",
              },
            },
          ]}
          onClick={handleFilterClick}
          variant="outlined"
          startIcon={
            <FilterAltSharpIcon
              sx={{ marginRight: 0, color: "white" }}
              width={22}
              height={22}
            />
          }
          endIcon={
            <KeyboardDoubleArrowRightIcon
              sx={{ color: "white" }}
              width={10}
              height={10}
            />
          }
        >
          <Box sx={{ px: 1 }}>Filtrer</Box>
        </Button>
      </Box>
      <Popper
        open={filtersAnchor}
        anchorEl={filterButtonRef.current}
        placement="right-start"
        sx={{
          zIndex: 1201,
          overflow: "auto",
        }}
        modifiers={[
          {
            name: "preventOverflow",
            enabled: false,
          },
        ]}
      >
        <Box
          sx={{
            overflow: "auto",
            boxShadow: "none",
            borderLeft: 1,
            bgcolor: "white",
            color: "black",
            p: 2,
            minWidth: 330,
            maxWidth: 375,
            maxHeight: "100%",
            "& .MuiSlider-thumb": {
              borderRadius: 0,
              width: 15,
              height: 15,
              "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                boxShadow: "inherit",
              },
            },
            "& .MuiTypography-body1": { fontSize: "0.9rem" },
            "& .MuiOutlinedInput-root": { borderRadius: 0 },
            "& .MuiToggleButton-root": { borderRadius: 0 },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "text.secondary",
            },
            "& .MuiButtonBase-root": {
              "&.Mui-checked": {
                color: "secondary.main",
              },
              "&.MuiToggleButton-root": {
                "&.Mui-selected": {
                  bgcolor: "secondary.main",
                  color: "black",
                  ":hover": {
                    bgcolor: "#8FC6C1",
                  },
                },
              },
            },
          }}
        >
          {Object.keys(props.params).map((key, i) => (
            <span key={i}>{renderParam(key as keyof typeof props.params)}</span>
          ))}
        </Box>
      </Popper>
    </>
  );
};
