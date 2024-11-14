import { FishingFacilityToolType } from "generated/openapi";

export const FishingFacilityToolTypes: Record<FishingFacilityToolType, string> =
  {
    [FishingFacilityToolType.Unknown]: "Ukjent",
    [FishingFacilityToolType.Undefined]: "Udefinert",
    [FishingFacilityToolType.Crabpot]: "Krabbeteine",
    [FishingFacilityToolType.Danpurseine]: "Not",
    [FishingFacilityToolType.Nets]: "Garn",
    [FishingFacilityToolType.Longline]: "Line",
    [FishingFacilityToolType.Generic]: "Generisk",
    [FishingFacilityToolType.Sensorbuoy]: "Sensorbøye",
    [FishingFacilityToolType.Sensorcable]: "Sensorkabel",
    [FishingFacilityToolType.Seismic]: "Seismisk",
    [FishingFacilityToolType.Mooring]: "Fortøyning",
    [FishingFacilityToolType.PlannedCableLaying]: "Planlagt kabellegging",
  };
