import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps, UserManager } from "oidc-react";

export const authConfig: AuthProviderProps = {
  autoSignIn: false,
  onBeforeSignIn: () => {
    window.localStorage.setItem(
      "redirect",
      window.location.pathname + window.location.search,
    );
  },
  onSignIn: () => {
    window.location.href = window.location.origin;
  },
  userManager: new UserManager({
    accessTokenExpiringNotificationTimeInSeconds: 1,
    automaticSilentRenew: true,
    authority: process.env.REACT_APP_BARENTSWATCH_AUTH as string,
    client_id: "fhf-datafangst",
    redirect_uri: window.location.origin,
    scope: "openid api",
    loadUserInfo: false,
    post_logout_redirect_uri: window.location.origin,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  }),
};
