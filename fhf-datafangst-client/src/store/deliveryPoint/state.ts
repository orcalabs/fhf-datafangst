import { DeliveryPoint } from "generated/openapi";

export interface DeliveryPointState {
  deliveryPoints: DeliveryPoint[];
}

export const initialDeliveryPointState: DeliveryPointState = {
  deliveryPoints: [],
};
