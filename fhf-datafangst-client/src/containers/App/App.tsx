import { CssBaseline } from "@mui/material";
import { Layout } from "components";
import { HomeView } from "containers";
import { Route, Routes } from "react-router-dom";

export const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<HomeView />} />
        </Routes>
      </Layout>
    </>
  );
};
