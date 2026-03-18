import { User } from "generated/openapi";

export interface UserState {
  user?: User;
  userLoading: boolean;
}

export const initialUserState: UserState = {
  user: undefined,
  userLoading: false,
};
