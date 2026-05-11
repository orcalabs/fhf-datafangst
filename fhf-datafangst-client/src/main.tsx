import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import "overlayscrollbars/overlayscrollbars.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { authConfig } from "~/app/auth";
import theme from "~/app/theme";
import { store } from "~/store";
import "~/utils/prototypes.ts";
import { FishmapProvider } from "./components";
import { App } from "./containers/App/App";
import "./index.css";

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
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Provider store={store}>
            <FishmapProvider>
              <App />
            </FishmapProvider>
          </Provider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>,
  );
}
