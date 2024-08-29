import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import theme from "app/theme";
import { LocalLoadingProgress, PaginationButtons } from "components";
import { FishingFacility } from "generated/openapi";
import { FishingFacilityToolTypes } from "models";
import { FC } from "react";
import {
  paginateFishingFacilitiesSearch,
  selectFishingFacilities,
  selectFishingFacilitiesLoading,
  selectFishingFacilitySearch,
  selectSelectedFishingFacility,
  setFishingFacilitiesSearch,
  setSelectedFishingFacility,
  useAppDispatch,
  useAppSelector,
} from "store";
import { dateFormat } from "utils";

const listItemSx = {
  px: 2.5,
  "&.Mui-selected": {
    bgcolor: "primary.dark",
    "&:hover": { bgcolor: "primary.dark" },
  },
  "&:hover": { bgcolor: "primary.light" },
};

export const MyGears: FC = () => {
  const dispatch = useAppDispatch();
  const gearsLoading = useAppSelector(selectFishingFacilitiesLoading);
  const gears = useAppSelector(selectFishingFacilities);
  const gearsSearch = useAppSelector(selectFishingFacilitySearch);
  const selectedGearId = useAppSelector(selectSelectedFishingFacility)?.toolId;

  const offset = gearsSearch?.offset ?? 0;
  const limit = gearsSearch?.limit ?? 10;

  const handleGearChange = (gear: FishingFacility) => {
    const newGear = gear.toolId === selectedGearId ? undefined : gear;
    dispatch(setSelectedFishingFacility(newGear));
  };

  const handleGearsPagination = (offset: number, limit: number) => {
    dispatch(paginateFishingFacilitiesSearch({ offset, limit }));
  };

  const handleGearsViewChange = (checked: boolean) => {
    if (checked) {
      dispatch(
        setFishingFacilitiesSearch({ ...gearsSearch, active: undefined }),
      );
    } else {
      dispatch(setFishingFacilitiesSearch({ ...gearsSearch, active: true }));
    }
  };

  return (
    <List sx={{ color: "white", pt: 0 }}>
      <ListSubheader
        sx={{
          bgcolor: "primary.light",
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "text.secondary",
                  "&.Mui-checked": {
                    color: "text.secondary",
                  },
                }}
                icon={<CheckBoxOutlineBlankSharpIcon />}
                checkedIcon={<CheckBoxSharpIcon />}
                size="small"
                checked={!gearsSearch?.active}
                onChange={(event) =>
                  handleGearsViewChange(event.target.checked)
                }
              />
            }
            label="Vis historiske redskap"
          />
        </FormGroup>
      </ListSubheader>
      {gearsLoading ? (
        <Box sx={{ pt: 2, pl: 2.5 }}>
          <LocalLoadingProgress />
        </Box>
      ) : !gears?.length ? (
        <Box sx={{ pt: 2, pl: 2.5 }}>Ingen resultater </Box>
      ) : (
        <>
          {gears?.map((g) => (
            <ListItemButton
              dense
              key={g.toolId}
              sx={listItemSx}
              selected={selectedGearId === g.toolId}
              onClick={() => handleGearChange(g)}
            >
              <ListItemAvatar sx={{ pr: 2 }}>
                <PhishingSharpIcon
                  width="32"
                  height="32"
                  fill={theme.palette.secondary.main}
                />
              </ListItemAvatar>
              <ListItemText
                primary={FishingFacilityToolTypes[g.toolType]}
                secondary={`${dateFormat(g.setupTimestamp, "PPP")} - ${
                  g.removedTimestamp
                    ? dateFormat(g.removedTimestamp, "PPP")
                    : "Nå"
                }`}
              />
            </ListItemButton>
          ))}

          <Box sx={{ mt: 1 }}>
            <PaginationButtons
              numItems={gears?.length ?? 0}
              offset={offset}
              limit={limit}
              onPaginationChange={handleGearsPagination}
            />
          </Box>
        </>
      )}
    </List>
  );
};
