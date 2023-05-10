import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import { Filters, MyTrips, VesselInfo } from "components";
import { Vessel } from "generated/openapi";
import { FC, useState } from "react";
import {
  selectIsLoggedIn,
  selectTripsSearch,
  setTripsSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";

interface Props {
  vessel?: Vessel;
}

const accordionSx = {
  m: 0,
  color: "white",
  boxShadow: "none",
  bgcolor: "primary.main",
  "&.Mui-expanded": {
    m: 0,
    bgcolor: "primary.main",
    "&:hover": { bgcolor: "primary.main" },
  },
  "& .MuiAccordionSummary-root": {
    py: 2,
    px: 2.5,
    "&:hover": { bgcolor: "primary.dark" },
  },
  "& .MuiAccordionSummary-content": { m: 0, alignItems: "center" },

  "&:before": { display: "none" },
};

export const MyPage: FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const tripsSearch = useAppSelector(selectTripsSearch);

  const { vessel } = props;
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const [expanded, setExpanded] = useState<string | false>("hauls");

  const handleChange = (expandedName: string) => {
    setExpanded(expandedName);

    if (vessel) {
      dispatch(setTripsSearch({ ...tripsSearch, vessel }));
    }
  };

  const content = () => {
    if (!loggedIn) {
      return (
        <>
          <Typography variant="h6">
            Du må være innlogget for å se denne siden
          </Typography>
          <Button
            sx={{
              borderRadius: 0,
              width: "110px",
              mt: 1,
              bgcolor: "secondary.main",
              color: "white",
              ":hover": {
                bgcolor: "secondary.light",
              },
            }}
          >
            Logg inn
          </Button>
        </>
      );
    } else {
      return (
        <>
          <VesselInfo vessel={vessel} />
          {vessel && (
            <>
              <Divider
                sx={{ bgcolor: "text.secondary", mt: 3, mb: 1, mx: 4 }}
              />
              <Accordion
                square
                disableGutters
                sx={accordionSx}
                expanded={expanded === "hauls"}
                onChange={() => handleChange("hauls")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                >
                  <Box
                    sx={{
                      display: "flex",
                      "& svg": { mr: 2 },
                    }}
                  >
                    <FishIcon
                      width="32"
                      height="32"
                      fill={`${theme.palette.secondary.light}`}
                    />
                  </Box>
                  <Typography variant="h6"> Mine hal </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 0 }}>
                  <Filters selectedVessel={vessel} />
                </AccordionDetails>
              </Accordion>
              <Accordion
                square
                disableGutters
                sx={accordionSx}
                expanded={expanded === "trips"}
                onChange={() => handleChange("trips")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                >
                  <Box
                    sx={{
                      display: "flex",
                      "& svg": { mr: 2 },
                    }}
                  >
                    <AllInclusiveSharpIcon
                      sx={{ color: "secondary.light", fontSize: 32 }}
                    />
                  </Box>
                  <Typography variant="h6"> Mine turer </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 0 }}>
                  <MyTrips />
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </>
      );
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          height: "100%",
          "& .MuiDrawer-paper": {
            width: 500,
            position: "relative",
            boxSizing: "border-box",
            bgcolor: "primary.main",
            color: "white",
            flexShrink: 0,
            height: "100%",
          },
          "& .MuiOutlinedInput-root": { borderRadius: 0 },
          "& .MuiChip-filled": {
            color: "black",
            bgcolor: "secondary.main",
            borderRadius: 0,
          },
        }}
      >
        {content()}
      </Drawer>
    </Box>
  );
};
