import { WebStorageStateStore } from "oidc-client-ts";
import type { AuthProviderProps } from "oidc-react";
import { UserManager } from "oidc-react";
import { AppPage } from "~/models";

export const authConfig: AuthProviderProps = {
  autoSignIn: false,
  onBeforeSignIn: () => {
    window.localStorage.setItem(
      "redirect",
      window.location.pathname + window.location.search,
    );
  },
  onSignIn: () => {
    // Redirect after login will go to location.origin. Check localstorage if there is a
    // subpath to route to after login redirect
    const redirect = localStorage.getItem("redirect");
    if (
      redirect &&
      Object.values(AppPage).some((v) => redirect.substring(1).startsWith(v))
    ) {
      localStorage.removeItem("redirect");
      window.location.href = window.location.origin + redirect;
    }
  },
  userManager: new UserManager({
    accessTokenExpiringNotificationTimeInSeconds: 1,
    automaticSilentRenew: true,
    authority: import.meta.env.VITE_BARENTSWATCH_AUTH as string,
    client_id: "fhf-datafangst",
    redirect_uri: window.location.origin,
    scope: "openid api",
    loadUserInfo: false,
    post_logout_redirect_uri: window.location.origin,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  }),
};
