import { WebStorageStateStore } from "oidc-client-ts";
import {
  AuthContextProps,
  AuthProvider as BaseAuthProvider,
  AuthProviderProps,
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
    authority: process.env.REACT_APP_BARENTSWATCH_AUTH as string,
    client_id: "fhf-datafangst",
    redirect_uri: window.location.origin,
    scope: "openid api",
    loadUserInfo: false,
    post_logout_redirect_uri: window.location.origin,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  }),
};

const isMobile = !!(process.env.REACT_APP_MOBILE as string);

export const useAuth: typeof baseUseAuth = isMobile
  ? (): AuthContextProps => ({
      signIn: async () => {},
      signInCallback: async () => {},
      signInPopup: async () => {},
      signOut: async () => {},
      signOutRedirect: async () => {},
      userManager: authConfig.userManager!,
      userData: new User({
        access_token: "TODO",
        token_type: "Bearer",
        profile: {
          aud: "fhf-datafangst",
          exp: 1774350243000,
          iat: 1774349943000,
          idp: "local",
          iss: "https://id.pilot.bwlab.no",
          sid: "TODO",
          sub: "TODO",
        },
      }),
      isLoading: false,
    })
  : baseUseAuth;

export const AuthProvider: typeof BaseAuthProvider = isMobile
  ? ({ children }) => <>{children}</>
  : BaseAuthProvider;
