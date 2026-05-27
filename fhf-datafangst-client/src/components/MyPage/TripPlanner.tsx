import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState, type FC } from "react";
import { getPrice } from "~/api";
import {
  ConditionSelect,
  GearGroupSelect,
  LocalLoadingProgress,
  NumberInput,
  QualitySelect,
  SpeciesSelect,
} from "~/components";
import type { Condition, Quality } from "~/generated/openapi";
import {
  selectCurrentTripLoading,
  selectLoggedInVessel,
  selectTrack,
  selectTrackLoading,
  useAppSelector,
} from "~/store";
import { TripPlannerRoute, type Route } from "./TripPlannerRoute";

export const TripPlanner: FC = () => {
  const vessel = useAppSelector(selectLoggedInVessel)!;
  const track = useAppSelector(selectTrack);
  const tripLoading = useAppSelector(selectCurrentTripLoading);
  const trackLoading = useAppSelector(selectTrackLoading);

  const [gearGroup, setGearGroup] = useState(
    vessel.gearGroups.length === 1 ? vessel.gearGroups[0] : undefined,
  );
  const [species, setSpecies] = useState<number | undefined>(undefined);
  const [condition, setCondition] = useState<Condition | undefined>(undefined);
  const [quality, setQuality] = useState<Quality | undefined>(undefined);
  const [speciesPrice, setSpeciesPrice] = useState<number | undefined>(
    undefined,
  );
  const [targetWeight, setTargetWeight] = useState<number | undefined>(
    undefined,
  );
  const [haulTime, setHaulTime] = useState<number | undefined>(undefined);
  const [steamFuelPerDay, setSteamFuelPerDay] = useState<number | undefined>(
    undefined,
  );
  const [steamSpeedKnots, setSteamSpeedKnots] = useState<number | undefined>(
    undefined,
  );
  const [haulFuelPerDay, setHaulFuelPerDay] = useState<number | undefined>(
    undefined,
  );
  const [fuelPrice, setFuelPrice] = useState<number | undefined>(undefined);
  const [showDistance, setShowDistance] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([defaultRoute()]);
  const [selectedRoute, setSelectedRoute] = useState<number | undefined>(0);

  useEffect(() => {
    if (gearGroup && species && condition && quality) {
      getPrice({
        lengthGroup: vessel.fiskeridir.lengthGroupId,
        gearGroup,
        species,
        condition,
        quality,
      }).then((v) => setSpeciesPrice(v ?? undefined));
    }
  }, [gearGroup, species, condition, quality]);

  if (tripLoading || trackLoading) {
    return <LocalLoadingProgress />;
  }

  return (
    <Stack sx={{ pb: 2, pr: 2, gap: 2 }}>
      <GearGroupSelect
        value={gearGroup}
        options={vessel.gearGroups.length > 0 ? vessel.gearGroups : undefined}
        onChange={setGearGroup}
      />
      <SpeciesSelect value={species} onChange={setSpecies} />
      <ConditionSelect value={condition} onChange={setCondition} />
      <QualitySelect value={quality} onChange={setQuality} />

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <NumberInput
          title="Fangst (kg)"
          endAdornment="kg"
          value={targetWeight}
          onChange={setTargetWeight}
        />
        <NumberInput
          decimal
          title="Pris (kr/kg)"
          endAdornment="kr/kg"
          value={speciesPrice}
          onChange={setSpeciesPrice}
        />
      </Stack>

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <NumberInput
          title="Haletid (timer)"
          endAdornment="timer"
          value={haulTime}
          onChange={setHaulTime}
        />
        <NumberInput
          title="Forbruk (liter/døgn)"
          endAdornment="liter/døgn"
          value={haulFuelPerDay}
          onChange={setHaulFuelPerDay}
        />
      </Stack>

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <NumberInput
          decimal
          title="Steaming fart (knop)"
          endAdornment="knop"
          value={steamSpeedKnots}
          onChange={setSteamSpeedKnots}
        />
        <NumberInput
          title="Forbruk (liter/døgn)"
          endAdornment="liter/døgn"
          value={steamFuelPerDay}
          onChange={setSteamFuelPerDay}
        />
      </Stack>

      <NumberInput
        decimal
        title="Drivstoff pris (kr/liter)"
        endAdornment="kr/liter"
        value={fuelPrice}
        onChange={setFuelPrice}
      />

      <FormControlLabel
        label="Vis distanse"
        control={
          <Switch
            color="secondary"
            checked={showDistance}
            onChange={(_, v) => setShowDistance(v)}
          />
        }
      />

      <Divider
        sx={{
          my: 1,
          bgcolor: "rgba(255, 255, 255, 0.5)",
        }}
      />

      <Box>
        {routes.map(({ steamingFuel }, i) => {
          const totalFuel =
            haulFuelPerDay !== undefined
              ? (steamingFuel ?? 0) + (haulTime ?? 0) * (haulFuelPerDay / 24)
              : steamingFuel;

          const totalFuelPrice =
            fuelPrice !== undefined ? totalFuel * fuelPrice : undefined;

          const totalCatchPrice =
            targetWeight !== undefined && speciesPrice !== undefined
              ? targetWeight * speciesPrice
              : undefined;

          const profit =
            totalFuelPrice !== undefined && totalCatchPrice !== undefined
              ? totalCatchPrice - totalFuelPrice
              : undefined;

          return (
            <Accordion
              key={i}
              expanded={selectedRoute === i}
              onChange={(_, expanded) =>
                setSelectedRoute(expanded ? i : undefined)
              }
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography component="span" sx={{ width: "50%" }}>
                  Tur {i + 1}
                </Typography>
                {profit !== undefined && (
                  <Typography
                    component="span"
                    sx={{ color: profit > 0 ? "green" : "red" }}
                  >
                    {profit > 0 ? "+" : ""}
                    {profit.toFixed(0)}
                  </Typography>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <TripPlannerRoute
                  selected={selectedRoute === i}
                  targetWeight={targetWeight}
                  speciesPrice={speciesPrice}
                  haulTime={haulTime}
                  haulFuelPerDay={haulFuelPerDay}
                  steamFuelPerDay={steamFuelPerDay}
                  steamSpeedKnots={steamSpeedKnots}
                  fuelPrice={fuelPrice}
                  initialPoint={track?.last()}
                  showDistance={showDistance}
                  onChange={(route) =>
                    setRoutes((r) => r.map((v, j) => (i === j ? route : v)))
                  }
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      <Button
        variant="text"
        color="secondary"
        onClick={() => {
          setRoutes((v) => [...v, defaultRoute()]);
          setSelectedRoute(routes.length);
        }}
      >
        Legg til tur
      </Button>
    </Stack>
  );
};

const defaultRoute = (): Route => ({ distance: 0, steamingFuel: 0 });
