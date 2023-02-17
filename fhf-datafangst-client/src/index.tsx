import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { App } from "./containers";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import theme from "app/theme";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "store";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </StyledEngineProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
