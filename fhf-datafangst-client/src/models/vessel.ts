export interface Vessel {
  fiskeridirVessel: FiskeridirVessel;
  aisVessel?: AisVessel;
}

export interface FiskeridirVessel {
  id: number;
  nationId: string;
  buildingYear?: number;
  callSign?: string;
  engineBuildingYear?: number;
  enginePower?: number;
  grosstonnage1969?: number;
  grossTonnageOther?: number;
  length?: number;
  lengthGroupId?: number;
  name?: string;
  nationGroupId?: string;
  norweiganCountyId?: number;
  norwegianMunicipalityId?: number;
  owner?: string;
  rebuildingYear?: number;
  registrationId?: string;
  vesselTypeId?: number;
  width?: number;
}

export interface AisVessel {
  mmsi: number;
  callSign?: string;
  desitnation?: string;
  eta?: string;
  imoNumber?: number;
  name?: string;
  shipLength?: number;
  shipWidth?: number;
}
