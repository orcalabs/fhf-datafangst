import { CssBaseline } from "@mui/material";
import { authConfig } from "app/auth";
import { Layout } from "components";
import { HomeView } from "containers";
import { AuthProvider } from "oidc-react";
import { Navigate, Route, Routes } from "react-router";
import { MenuViewState } from "store";

export const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <AuthProvider {...authConfig}>
        <Layout>
          <Routes>
            {Object.values(MenuViewState).map((view) => (
              <Route
                key={view}
                path={view}
                element={<HomeView view={view} />}
              />
            ))}

            {/* NB! Fallback redirect, must be last! */}
            <Route path="*" element={<Navigate to={MenuViewState.Live} />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </>
  );
};
