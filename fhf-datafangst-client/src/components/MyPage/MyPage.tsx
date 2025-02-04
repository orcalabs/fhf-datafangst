import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import SettingsIcon from "@mui/icons-material/Settings";
import SpeedIcon from "@mui/icons-material/Speed";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import {
  LocalLoadingProgress,
  MyGears,
  MyHauls,
  Trips,
  VesselInfo,
} from "components";
import { MyPageSubmenu, useMyPageSubmenu } from "hooks";
import { useAuth } from "oidc-react";
import { FC, useEffect, useState } from "react";
import {
  getCurrentTrip,
  initialHaulsMatrixSearch,
  selectBwUserLoading,
  selectFishingFacilitySearch,
  selectHaulsMatrixSearch,
  selectIsLoggedIn,
  selectLoggedInVessel,
  selectVesselsLoading,
  setFishingFacilitiesSearch,
  setHaulsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "store";

enum MenuTab {
  Trips = "trips",
  Hauls = "hauls",
  Gears = "gears",
  Following = "following",
}

const accordionSx = {
  m: 0,
  color: "white",
  boxShadow: "none",
  bgcolor: "primary.light",
  "&.Mui-expanded": {
    m: 0,
    bgcolor: "primary.light",
    "&:hover": { bgcolor: "primary.light" },
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
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const [expanded, setExpanded] = useState<MenuTab | false>(MenuTab.Trips);
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const fishingFacilitiesSearch = useAppSelector(selectFishingFacilitySearch);
  const userLoading = useAppSelector(selectBwUserLoading);
  const vessel = useAppSelector(selectLoggedInVessel);
  const vesselsLoading = useAppSelector(selectVesselsLoading);
  const [subMenu, setSubmenu] = useMyPageSubmenu();

  useEffect(() => {
    if (expanded === MenuTab.Trips && vessel) {
      dispatch(getCurrentTrip({ vessel }));
    }
  }, [expanded]);

  const handleTabChange = (expandedTab: MenuTab) => {
    setExpanded(expandedTab);

    if (expandedTab === MenuTab.Trips && vessel) {
      setSubmenu(MyPageSubmenu.Trips);
      dispatch(getCurrentTrip({ vessel }));
    } else if (expandedTab === MenuTab.Hauls && vessel) {
      setSubmenu(MyPageSubmenu.Area);
      dispatch(
        setHaulsMatrixSearch({
          ...initialHaulsMatrixSearch,
          ...haulsSearch,
          filter: undefined,
          vessels: [vessel],
        }),
      );
    } else if (expandedTab === MenuTab.Gears && vessel) {
      setSubmenu(MyPageSubmenu.Facility);
      dispatch(
        setFishingFacilitiesSearch({
          active: true,
          ...fishingFacilitiesSearch,
          vessels: [vessel],
        }),
      );
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

  if (userLoading || vesselsLoading) {
    return (
      <Box sx={{ pt: 4 }}>
        <LocalLoadingProgress />
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
        expanded={expanded === MenuTab.Trips}
        onChange={() => handleTabChange(MenuTab.Trips)}
        slotProps={{
          transition: { unmountOnExit: true },
        }}
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
        <AccordionDetails sx={{ pb: 0, pr: 0 }}>
          <Trips />
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        disableGutters
        sx={accordionSx}
        expanded={expanded === MenuTab.Hauls}
        onChange={() => handleTabChange(MenuTab.Hauls)}
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
          <Typography variant="h6"> Mine områder </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2.5, pb: 2, pt: 0 }}>
          <MyHauls selectedVessel={vessel} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        square
        disableGutters
        sx={accordionSx}
        expanded={expanded === MenuTab.Gears}
        onChange={() => handleTabChange(MenuTab.Gears)}
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
            <PhishingSharpIcon
              sx={{ color: "secondary.light", fontSize: 32 }}
            />
          </Box>
          <Typography variant="h6"> Mine redskap </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pb: 0 }}>
          <MyGears />
        </AccordionDetails>
      </Accordion>
      <Button
        variant="contained"
        sx={{
          m: 0,
          width: "100%",
          py: 2,
          px: 2.5,
          justifyContent: "start",
          borderRadius: 0,
          color: "white",
          boxShadow: "none",
          bgcolor:
            subMenu === MyPageSubmenu.Stats ? "primary.dark" : "primary.light",
          ":hover": {
            bgcolor: "primary.dark",
          },
        }}
        onClick={() => {
          setSubmenu(MyPageSubmenu.Stats);
          setExpanded(false);
        }}
      >
        <Box
          sx={{
            display: "flex",
            "& svg": { mr: 2 },
          }}
        >
          <SpeedIcon sx={{ color: "secondary.light", fontSize: 32 }} />
        </Box>
        <Typography variant="h6"> Min statistikk </Typography>
      </Button>
      <Button
        variant="contained"
        sx={{
          m: 0,
          width: "100%",
          py: 2,
          px: 2.5,
          justifyContent: "start",
          borderRadius: 0,
          color: "white",
          boxShadow: "none",
          bgcolor:
            subMenu === MyPageSubmenu.Administrate
              ? "primary.dark"
              : "primary.light",
          ":hover": {
            bgcolor: "primary.dark",
          },
        }}
        onClick={() => {
          setSubmenu(MyPageSubmenu.Administrate);
          setExpanded(false);
        }}
      >
        <Box
          sx={{
            display: "flex",
            "& svg": { mr: 2 },
          }}
        >
          <SettingsIcon sx={{ color: "secondary.light", fontSize: 32 }} />
        </Box>
        <Typography variant="h6"> Administrer </Typography>
      </Button>
    </Box>
  );
};
