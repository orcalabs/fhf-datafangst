import { WebStorageStateStore } from "oidc-client-ts";
import type { AuthContextProps, AuthProviderProps } from "oidc-react";
import {
  AuthProvider as BaseAuthProvider,
  useAuth as baseUseAuth,
  User,
  UserManager,
} from "oidc-react";

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
    authority: import.meta.env.VITE_BARENTSWATCH_AUTH as string,
    client_id: "fhf-datafangst",
    redirect_uri: window.location.origin,
    scope: "openid api",
    loadUserInfo: false,
    post_logout_redirect_uri: window.location.origin,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  }),
};

const isMobileDev =
  !!(import.meta.env.VITE_MOBILE_DEV as string) &&
  (import.meta.env.VITE_ENV as string) === "staging";

export const useAuth: typeof baseUseAuth = isMobileDev
  ? (): AuthContextProps => ({
      signIn: async () => {},
      signInCallback: async () => {},
      signInPopup: async () => {},
      signOut: async () => {},
      signOutRedirect: async () => {},
      userManager: authConfig.userManager!,
      userData: new User({
        access_token: "******",
        token_type: "Bearer",
        profile: {
          aud: "fhf-datafangst",
          exp: 1774350243000,
          iat: 1774349943000,
          idp: "local",
          iss: "https://id.pilot.bwlab.no",
          sid: "",
          sub: "",
        },
      }),
      isLoading: false,
    })
  : baseUseAuth;

export const AuthProvider: typeof BaseAuthProvider = isMobileDev
  ? ({ children }) => children
  : BaseAuthProvider;
