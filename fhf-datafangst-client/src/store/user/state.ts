import { User, Vessel } from "generated/openapi";

export interface UserState {
  user?: User;
  userLoading: boolean;
  userVessels: Vessel[];
}

export const initialUserState: UserState = {
  user: undefined,
  userLoading: false,
  userVessels: [],
};
