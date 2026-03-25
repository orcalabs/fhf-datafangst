import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { authConfig, AuthProvider } from "app/auth";
import theme from "app/theme";
import { App } from "containers/App/App";
import { nb } from "date-fns/locale";
import "overlayscrollbars/overlayscrollbars.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { store } from "store";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

if (window !== window.top) {
  // `window !== window.top` means that the app is currently being rendered inside an iframe,
  // which happens during auth token renewal.
  authConfig.userManager!.signinSilentCallback();
  if (window.frameElement) {
    window.parent.document.body.removeChild(window.frameElement);
  }
} else {
  const container = document.getElementById("root");
  const root = createRoot(container!);

  root.render(
    <StyledEngineProvider injectFirst>
      <AuthProvider {...authConfig} autoSignIn={true}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={nb}>
            <BrowserRouter>
              <Provider store={store}>
                <App />
              </Provider>
            </BrowserRouter>
          </LocalizationProvider>
        </ThemeProvider>
      </AuthProvider>
    </StyledEngineProvider>,
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
