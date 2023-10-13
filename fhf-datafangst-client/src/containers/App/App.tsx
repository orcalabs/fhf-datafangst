import { CssBaseline } from "@mui/material";
import { Layout } from "components";
import { HomeView, BenchmarkView } from "containers";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "oidc-react";
import { authConfig } from "app/auth";

export const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <AuthProvider {...authConfig}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/BenchmarkView" element={<BenchmarkView />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </>
  );
};
