import { Box, Typography } from "@mui/material";
import {
  BenchmarkCards,
  Header,
  BmHeaderMenuButtons,
  SpeciesHistogram,
} from "components";
import { FC } from "react";
import { useAuth } from "oidc-react";
import {
  selectBwUserProfile,
  selectIsLoggedIn,
  selectTrips,
  selectVesselsByCallsign,
  useAppSelector,
} from "store";
import { useNavigate } from "react-router-dom";

const GridContainer = (props: any) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "500px 1fr 500px",
      gridTemplateRows: "48px 56px 1fr 100px",
      position: "absolute",
      width: "100%",
      height: "100%",
    }}
  >
    {props.children}
  </Box>
);

const HeaderTrack = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 4,
      gridRowStart: 1,
      gridRowEnd: 2,
    }}
  >
    {props.children}
  </Box>
);

const HeaderButtonCell = (props: any) => (
  <Box
    sx={{
      gridColumnStart: 1,
      gridColumnEnd: 2,
      gridRowStart: 1,
      gridRowEnd: 2,
    }}
  >
    {props.children}
  </Box>
);

export const BenchmarkView: FC = () => {
  const { signIn } = useAuth();
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const profile = useAppSelector(selectBwUserProfile);
  const vesselInfo = profile?.vesselInfo;
  const vessels = useAppSelector(selectVesselsByCallsign);
  const vessel = vesselInfo?.ircs ? vessels[vesselInfo.ircs] : undefined;
  const navigate = useNavigate();
  const trips = useAppSelector(selectTrips);

  if (!loggedIn) {
    signIn();
  }

  if (!vessel) {
    navigate("/");
    return <p>No vessel associated with this user</p>;
  }
  return (
    <Box
      sx={{
        display: "grid",
        backgroundColor: "primary.main",
        height: "100vh",
        width: "100vw",
      }}
    >
      <GridContainer>
        <HeaderTrack>
          <Header />
        </HeaderTrack>
        <HeaderButtonCell>
          <BmHeaderMenuButtons />
        </HeaderButtonCell>
      </GridContainer>
      {trips?.length && (
        <Box>
          <BenchmarkCards />
          <SpeciesHistogram />
        </Box>
      )}
      {(!trips || trips.length === 0) && (
        <Box sx={{ justifySelf: "center" }}>
          <Typography color="text.secondary" variant="h2">
            {" "}
            Du har ingen registrerte turer.
          </Typography>
          <Typography color="text.secondary" variant="h5">
            {" "}
            For at vi skal kunne gi deg statistikk må du ha registrert noen
            turer.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
