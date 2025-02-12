import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import SettingsIcon from "@mui/icons-material/Settings";
import SpeedIcon from "@mui/icons-material/Speed";
import {
  Accordion,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { HaulsFilter } from "api";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import {
  CurrentTripMenu,
  HaulFilters,
  HaulsLayer,
  HaulsMenu,
  LocalLoadingProgress,
  LocationsGrid,
  MyGears,
  MySettings,
  MyStats,
  OverlayScrollbars,
  SelectedTripMenu,
  TimeSlider,
  TrackLayer,
  TripDetails,
  TripsLayer,
  TripsList,
  VesselInfo,
} from "components";
import { FishingFacilitiesLayer } from "components/Layers/FishingFacilitiesLayer";
import { PageLayoutLeft, PageLayoutRight } from "containers";
import {
  PageLayoutCenter,
  PageLayoutCenterBottom,
} from "containers/PageLayout/PageLayoutCenter";
import { MyPageSubmenu, useMyPageSubmenu } from "hooks";
import { useAuth } from "oidc-react";
import { FC, useEffect } from "react";
import {
  getCurrentTrip,
  initialHaulsMatrixSearch,
  selectBwUserLoading,
  selectCurrentTrip,
  selectFishingFacilitySearch,
  selectHaulsMatrixSearch,
  selectIsLoggedIn,
  selectLoggedInVessel,
  selectSelectedGridsString,
  selectSelectedHaul,
  selectSelectedTrip,
  selectTripDetailsOpen,
  selectVesselsLoading,
  setFishingFacilitiesSearch,
  setHaulDateSliderFrame,
  setHaulsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "store";
import { MinErsYear } from "utils";

const accordionSx = {
  borderTop: `1px solid ${theme.palette.grey[700]}`,

  "&:last-of-type": {
    borderBottom: `1px solid ${theme.palette.grey[700]}`,
  },

  "&::before": {
    display: "none",
  },
  m: 0,
  color: "white",
  boxShadow: "none",
  bgcolor: "primary.light",
  "&.Mui-expanded": {
    m: 0,
    bgcolor: theme.palette.primary.alt,
    "&:hover": { bgcolor: theme.palette.primary.alt },
  },
  "& .MuiAccordionDetails-root": {
    px: 4,
  },
  "& .MuiAccordionSummary-root": {
    bgcolor: "primary.light",
    py: 2,
    px: 2,
    "&:hover": { bgcolor: "primary.dark" },
    "&.Mui-expanded": {
      bgcolor: theme.palette.primary.alt,
    },
  },
  "& .MuiAccordionSummary-content": {
    m: 0,
    alignItems: "center",
  },
};

export const MyPage: FC = () => {
  const { signIn } = useAuth();

  const dispatch = useAppDispatch();

  const loggedIn = useAppSelector(selectIsLoggedIn);
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const currentTrip = useAppSelector(selectCurrentTrip);
  const selectedGrids = useAppSelector(selectSelectedGridsString);
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);
  const fishingFacilitiesSearch = useAppSelector(selectFishingFacilitySearch);
  const userLoading = useAppSelector(selectBwUserLoading);
  const vessel = useAppSelector(selectLoggedInVessel);
  const vesselsLoading = useAppSelector(selectVesselsLoading);
  const selectedHaul = useAppSelector(selectSelectedHaul);
  const tripDetailsOpen = useAppSelector(selectTripDetailsOpen);

  const [subMenu, setSubmenu] = useMyPageSubmenu();

  useEffect(() => {
    if (!vessel) return;

    if (subMenu === MyPageSubmenu.Trips) {
      dispatch(getCurrentTrip({ vessel }));
    } else if (subMenu === MyPageSubmenu.Area) {
      dispatch(
        setHaulsMatrixSearch({
          ...initialHaulsMatrixSearch,
          ...haulsSearch,
          vessels: [vessel],
        }),
      );
    } else if (subMenu === MyPageSubmenu.Facility) {
      dispatch(
        setFishingFacilitiesSearch({
          active: true,
          ...fishingFacilitiesSearch,
          vessels: [vessel],
        }),
      );
    }
  }, [subMenu, vessel]);

  if (userLoading || vesselsLoading) {
    return (
      <PageLayoutLeft>
        <Box sx={{ pt: 4 }}>
          <LocalLoadingProgress />
        </Box>
      </PageLayoutLeft>
    );
  }

  if (!loggedIn) {
    return (
      <PageLayoutLeft>
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
            onClick={() => signIn()}
          >
            Logg inn
          </Button>
        </Box>
      </PageLayoutLeft>
    );
  }

  if (!vessel) {
    return (
      <PageLayoutLeft>
        <Typography variant="h6" sx={{ p: 3 }}>
          Du har ingen registrerte fartøy
        </Typography>
      </PageLayoutLeft>
    );
  }

  return (
    <>
      <PageLayoutLeft>
        <Box sx={{ pb: 2.5, pt: 0.5 }}>
          <VesselInfo vessel={vessel} />
        </Box>

        <Accordion
          square
          disableGutters
          sx={accordionSx}
          expanded={subMenu === MyPageSubmenu.Trips}
          onChange={() => setSubmenu(MyPageSubmenu.Trips)}
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
        </Accordion>
        {subMenu === MyPageSubmenu.Trips && (
          <Stack
            sx={{
              pl: 2,
              bgcolor: theme.palette.primary.alt,
              overflowY: "hidden",
            }}
          >
            <TripsList />
          </Stack>
        )}
        <Accordion
          square
          disableGutters
          sx={accordionSx}
          expanded={subMenu === MyPageSubmenu.Area}
          onChange={() => setSubmenu(MyPageSubmenu.Area)}
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
        </Accordion>
        {subMenu === MyPageSubmenu.Area && (
          <Stack
            sx={{
              overflowY: "hidden",
              px: 2,
              bgcolor: theme.palette.primary.alt,
            }}
          >
            <OverlayScrollbars>
              <HaulFilters
                sx={{ px: 2.5, pb: 2.5, pt: 0 }}
                selectedVessel={vessel}
                removeSingleEntryFilters
              />
            </OverlayScrollbars>
          </Stack>
        )}
        <Accordion
          square
          disableGutters
          sx={accordionSx}
          expanded={subMenu === MyPageSubmenu.Facility}
          onChange={() => setSubmenu(MyPageSubmenu.Facility)}
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
        </Accordion>
        {subMenu === MyPageSubmenu.Facility && (
          <Stack
            sx={{
              pl: 2,
              bgcolor: theme.palette.primary.alt,
              overflowY: "hidden",
              borderBottom: `1px solid ${theme.palette.grey[700]}`,
            }}
          >
            <MyGears />
          </Stack>
        )}
        <Button
          variant="contained"
          sx={{
            borderTop: `2px solid ${theme.palette.text.secondary}`,
            borderBottom: `1px solid ${theme.palette.grey[700]}`,
            m: 0,
            width: "100%",
            py: 2,
            px: 2.5,
            justifyContent: "start",
            borderRadius: 0,
            color: "white",
            boxShadow: "none",
            marginTop: "auto",
            bgcolor:
              subMenu === MyPageSubmenu.Stats
                ? "primary.dark"
                : "primary.light",
            ":hover": {
              bgcolor: "primary.dark",
            },
          }}
          onClick={() => setSubmenu(MyPageSubmenu.Stats)}
          endIcon={<KeyboardArrowRightIcon sx={{ width: 24, height: 24 }} />}
        >
          <Box
            sx={{
              display: "flex",
              "& svg": { mr: 2 },
            }}
          >
            <SpeedIcon sx={{ color: "secondary.light", fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ width: "100%", textAlign: "left" }}>
            Statistikk
          </Typography>
        </Button>
        <Button
          variant="contained"
          sx={{
            borderBottom: `1px solid ${theme.palette.grey[700]}`,
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
          onClick={() => setSubmenu(MyPageSubmenu.Administrate)}
          endIcon={<KeyboardArrowRightIcon sx={{ width: 24, height: 24 }} />}
        >
          <Box
            sx={{
              display: "flex",
              "& svg": { mr: 2 },
            }}
          >
            <SettingsIcon sx={{ color: "secondary.light", fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ width: "100%", textAlign: "left" }}>
            Administrer
          </Typography>
        </Button>
      </PageLayoutLeft>
      <PageLayoutCenter
        open={subMenu === MyPageSubmenu.Trips && tripDetailsOpen}
        sx={{ zIndex: 1000 }}
      >
        <TripDetails />
      </PageLayoutCenter>
      <PageLayoutCenter
        open={subMenu === MyPageSubmenu.Administrate}
        sx={{ zIndex: 1000 }}
      >
        <MySettings />
      </PageLayoutCenter>
      <PageLayoutCenter
        open={subMenu === MyPageSubmenu.Stats}
        sx={{ zIndex: 1000 }}
      >
        <MyStats />
      </PageLayoutCenter>
      <PageLayoutCenterBottom
        open={subMenu === MyPageSubmenu.Area && selectedGrids.length === 0}
      >
        <TimeSlider
          options={haulsSearch}
          minYear={MinErsYear}
          onValueChange={(date: Date) => dispatch(setHaulDateSliderFrame(date))}
          onOpenChange={(open: boolean) => {
            dispatch(
              open
                ? setHaulsMatrixSearch({
                    ...haulsSearch,
                    filter: HaulsFilter.Date,
                  })
                : setHaulDateSliderFrame(undefined),
            );
          }}
        />
      </PageLayoutCenterBottom>
      <PageLayoutRight
        open={
          subMenu === MyPageSubmenu.Trips && (!!selectedTrip || !!currentTrip)
        }
      >
        {selectedTrip ? <SelectedTripMenu /> : <CurrentTripMenu />}
      </PageLayoutRight>
      <PageLayoutRight
        open={subMenu === MyPageSubmenu.Area && selectedGrids.length > 0}
      >
        <HaulsMenu />
      </PageLayoutRight>
      {(selectedTrip ?? currentTrip) ? (
        <TripsLayer />
      ) : (
        subMenu === MyPageSubmenu.Area && (
          <>
            {!!selectedHaul && <TrackLayer />}
            {selectedGrids.length > 0 && <HaulsLayer />}
            <LocationsGrid />
          </>
        )
      )}
      {subMenu === MyPageSubmenu.Facility && <FishingFacilitiesLayer />}
    </>
  );
};
