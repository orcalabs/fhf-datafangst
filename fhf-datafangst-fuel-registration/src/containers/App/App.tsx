import { CssBaseline } from "@mui/material";
import { Layout } from "components";
import { HomeView } from "containers";
import { useAuth } from "oidc-react";
import { useEffect } from "react";
import {
  checkLoggedIn,
  selectIsLoggedIn,
  useAppDispatch,
  useAppSelector,
} from "store";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData, isLoading } = useAuth();
  const loggedIn = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (userData && !isLoading) {
      dispatch(checkLoggedIn(userData));
    }
  }, [userData, isLoading]);

  return (
    <>
      {loggedIn && (
        <>
          <CssBaseline />
          <Layout>
            <HomeView />
          </Layout>
        </>
      )}
    </>
  );
};
