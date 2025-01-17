import { CssBaseline } from "@mui/material";
import { authConfig } from "app/auth";
import { Layout } from "components";
import { BenchmarkView, HomeView } from "containers";
import { AuthProvider } from "oidc-react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardViewState, MenuViewState } from "store";

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

            <Route path="dashboard" element={<BenchmarkView />} />
            {Object.values(DashboardViewState).map((view) => (
              <Route
                key={view}
                path={`dashboard/${view}`}
                element={<BenchmarkView view={view} />}
              />
            ))}

            {/* NB! Fallback redirect, must be last! */}
            <Route
              path="*"
              element={<Navigate to={MenuViewState.Overview} />}
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </>
  );
};
