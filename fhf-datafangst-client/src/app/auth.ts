import { AuthService } from "react-oauth2-pkce";

const barentswatch = process.env.REACT_APP_BARENTSWATCH_AUTH as string;

const authService = new AuthService({
  clientId: "fhf-datafangst",
  location: window.location,
  provider: barentswatch,
  authorizeEndpoint: barentswatch + "/connect/authorize",
  logoutEndpoint: barentswatch + "/connect/endsession",
  tokenEndpoint: barentswatch + "/connect/token",
  redirectUri: window.location.origin,
  autoRefresh: true,
  scopes: ["openid", "api"],
});

export const login = async () => authService.login();

export const logout = async () => authService.logout(true);

export const checkLoggedIn = authService.isAuthenticated;
