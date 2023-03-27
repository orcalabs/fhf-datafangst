import { AuthService } from "react-oauth2-pkce";

const authService = new AuthService({
  clientId: "fhf-datafangst",
  location: window.location,
  provider: "https://id.barentswatch.net",
  authorizeEndpoint: "https://id.barentswatch.net/connect/authorize",
  logoutEndpoint: "https://id.barentswatch.net/connect/endsession",
  tokenEndpoint: "https://id.barentswatch.net/connect/token",
  redirectUri: window.location.origin,
  autoRefresh: true,
  scopes: ["openid", "api"],
});

export const login = async () => authService.login();

export const logout = async () => authService.logout(true);

export const checkLoggedIn = authService.isAuthenticated;
