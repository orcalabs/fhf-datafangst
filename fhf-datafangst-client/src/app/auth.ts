import { AppPage } from "containers/App/App";
import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderProps, UserManager } from "oidc-react";

export const authConfig: AuthProviderProps = {
  autoSignIn: false,
  onBeforeSignIn: () => {
    window.localStorage.setItem("pathname", window.location.pathname);
    window.localStorage.setItem("searchParams", window.location.search);
  },
  onSignIn: () => {
    // Redirect after login will go to location.origin. Check localstorage if there is a
    // subpath to route to after login redirect
    const redirectPathname = localStorage.getItem("pathname");

    if (redirectPathname) {
      const subpath = redirectPathname.substring(1);
      if (Object.values(AppPage).includes(subpath as any)) {
        localStorage.removeItem("pathname");
        window.location.href = window.location.origin + redirectPathname;
      }
    }
    const searchParams = localStorage.getItem("searchParams");
    if (searchParams) {
      window.location.search = searchParams;
    }
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
