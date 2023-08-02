import { Box, Button, Popper } from "@mui/material";
import { FC, useRef } from "react";
import {
  DateFilter,
  GearFilter,
  SortingFilter,
  SpeciesFilter,
  VesselLengthFilter,
  WeightFilter,
} from "components";
import {
  selectTripFiltersOpen,
  setTripFiltersOpen,
  useAppDispatch,
  useAppSelector,
} from "store";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";
import { VesselFilter } from "components/Filters/VesselFilter";

interface Props {
  params: Record<string, any>;
  onChange: (_: any) => void;
}

export const SearchFilters: FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const filtersAnchor = useAppSelector(selectTripFiltersOpen);
  const filterButtonRef = useRef(null);

  const handleFilterClick = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(setTripFiltersOpen(!filtersAnchor));
  };

  const handleChange = (param: any) =>
    props.onChange({ ...props.params, ...param });

  const renderParam = (key: string, value: any) => {
    const onChange = (value: any) => handleChange({ [key]: value });

    switch (key) {
      case "vessels":
        return (
          <VesselFilter
            value={value}
            onChange={onChange}
            useVirtualization={true}
          />
        );
      case "dateRange":
        return <DateFilter value={value} onChange={onChange} />;
      case "speciesGroups":
        return <SpeciesFilter value={value} onChange={onChange} />;
      case "gearGroups":
        return <GearFilter value={value} onChange={onChange} />;
      case "vesselLengthGroups":
        return <VesselLengthFilter value={value} onChange={onChange} />;
      case "weight":
        return <WeightFilter value={value} onChange={onChange} />;
      case "sorting":
        return <SortingFilter value={value} onChange={onChange} />;
    }
  };

  const content = (
    <Box
      sx={{
        overflow: "auto",
        boxShadow: "none",
        borderLeft: 1,
        bgcolor: "white",
        color: "black",
        p: 2,
        minWidth: 330,
        maxWidth: 370,
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
      {Object.entries(props.params).map(([key, value], i) => (
        <span key={i}>{renderParam(key, value)}</span>
      ))}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          "& .MuiButton-root": {
            borderRadius: 0,
            border: 0,
            padding: "5px 10px",
            borderColor: "primary.dark",
            "&:hover": { bgcolor: "primary.dark", border: 0 },
            bgcolor: filtersAnchor ? "primary.dark" : "primary.main",
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
        {content}
      </Popper>
    </>
  );
};
