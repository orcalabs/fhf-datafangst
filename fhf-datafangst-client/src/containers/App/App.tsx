import { CssBaseline } from "@mui/material";
import { authConfig } from "app/auth";
import { Layout } from "components";
import { HomeView } from "containers";
import { AuthProvider } from "oidc-react";
import { Navigate, Route, Routes, useSearchParams } from "react-router";

export enum AppPage {
  Live = "live",
  Area = "area",
  Trips = "trips",
  MyPage = "mypage",
}

export const App: React.FC = () => {
  const [loginParam, _] = useSearchParams();
  const autoSignIn = !!loginParam.get("signedIn");

  return (
    <>
      <CssBaseline />
      <AuthProvider {...{ ...authConfig, autoSignIn: autoSignIn }}>
        <Layout>
          <Routes>
            {Object.values(AppPage).map((page) => (
              <Route
                key={page}
                path={page}
                element={<HomeView page={page} />}
              />
            ))}

            {/* NB! Fallback redirect, must be last! */}
            <Route path="*" element={<Navigate to={`/${AppPage.Live}`} />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </>
  );
};
