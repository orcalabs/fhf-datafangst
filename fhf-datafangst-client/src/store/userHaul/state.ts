import type { StartedUserHaul, UserHaul } from "~/generated/openapi";

export interface UserHaulState {
  userHauls?: UserHaul[];
  userHaulsLoading: boolean;
  activeUserHaul?: StartedUserHaul;
  activeUserHaulLoading: boolean;
  selectedUserHaul?: UserHaul;
}

export const initialUserHaulState: UserHaulState = {
  userHauls: undefined,
  userHaulsLoading: false,
  activeUserHaul: undefined,
  activeUserHaulLoading: false,
  selectedUserHaul: undefined,
};
