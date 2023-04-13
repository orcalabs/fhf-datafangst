import { VmsPosition } from "generated/openapi";

export interface VmsState {
  vms?: VmsPosition[];
  vmsLoading: boolean;
}

export const initialVmsState: VmsState = {
  vms: undefined,
  vmsLoading: false,
};
