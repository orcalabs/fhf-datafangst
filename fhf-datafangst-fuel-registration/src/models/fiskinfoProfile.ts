interface ContactDetails {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  userName: string | null;
}

interface VesselInfo {
  vesselId: string;
  mmsi: number | null;
  imo: number | null;
  ircs: string | null;
  regNum: string | null;
  sbrRegNum: string | null;
  vesselName: string | null;
  vesselPhone: string | null;
  vesselEmail: string | null;
}

// Incomplete compared to output, we only use the fields we require.
export interface BwUser {
  fiskInfoProfile: VesselInfo | null;
  user: ContactDetails;
  policies: string[] | null;
  roles: string[] | null;
}

export const Policies = {
  BwAisFiskinfo: "BwAisFiskinfo",
  BwReadExtendedFishingFacility: "BwReadExtendedFishingFacility",
  BwReadExtendedVesselInfo: "BwReadExtendedVesselInfo",
  BwReportFishingFacility: "BwReportFishingFacility",
  BwReportLost: "BwReportLost",
  BwUpdateVesselContactInfo: "BwUpdateVesselContactInfo",
  BwVesselSearch: "BwVesselSearch",
};

export const Roles = {
  BwDownloadFishingfacility: "BwDownloadFishingfacility",
  BwEksternFiskInfoUtvikler: "BwEksternFiskInfoUtvikler",
  BwFiskerikyndig: "BwFiskerikyndig",
  BwFiskinfoAdmin: "BwFiskinfoAdmin",
  BwUtdanningsBruker: "BwUtdanningsBruker",
  BwViewAis: "BwViewAis",
  BwYrkesfisker: "BwYrkesfisker",
};
