import { CssBaseline } from "@mui/material";
import { authConfig } from "app/auth";
import { Layout } from "components";
import { BenchmarkView, HomeView } from "containers";
import { AuthProvider } from "oidc-react";
import { Route, Routes } from "react-router-dom";

export const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <AuthProvider {...authConfig}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/benchmark" element={<BenchmarkView />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </>
  );
};
