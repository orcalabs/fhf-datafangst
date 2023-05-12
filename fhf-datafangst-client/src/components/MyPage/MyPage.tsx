import {
  Box,
  Button,
  Divider,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import { MyHauls, MyTrips, VesselInfo } from "components";
import { FC, useState } from "react";
import {
  selectBwUserProfile,
  selectIsLoggedIn,
  selectTripsSearch,
  selectVesselsByCallsign,
  setTripsSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import { useAuth } from "oidc-react";

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

export const MyPage: FC = () => {
  const dispatch = useAppDispatch();
  const { signIn } = useAuth();
  const tripsSearch = useAppSelector(selectTripsSearch);
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const [expanded, setExpanded] = useState<string | false>("hauls");
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;

  const handleChange = (expandedName: string) => {
    setExpanded(expandedName);

    if (vessel) {
      dispatch(setTripsSearch({ ...tripsSearch, vessel }));
    }
  };

  if (!loggedIn) {
    return (
      <Box sx={{ p: 3 }}>
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
          onClick={() => {
            signIn();
          }}
        >
          Logg inn
        </Button>
      </Box>
    );
  }

  if (!vessel) {
    return (
      <Typography variant="h6" sx={{ p: 3 }}>
        Du har ingen registrerte fartøy
      </Typography>
    );
  }

  return (
    <Box>
      <VesselInfo vessel={vessel} />
      <Divider sx={{ bgcolor: "text.secondary", mt: 3, mb: 1, mx: 4 }} />
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
        <AccordionDetails sx={{ px: 2.5, pb: 2, pt: 0 }}>
          <MyHauls selectedVessel={vessel} />
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
    </Box>
  );
};
