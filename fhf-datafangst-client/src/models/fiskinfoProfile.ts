export interface FiskInfoProfile {
  haveProfile: boolean;
  haveDownloadRights: boolean;
  contactPersonDetail: ContactDetails;
  vesselInfo: VesselInfo;
}

interface ContactDetails {
  id: string | null;
  firstName: string | null;
  phoneNumber: string | null;
  email: string | null;
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
