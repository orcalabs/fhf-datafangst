import { CssBaseline } from "@mui/material";
import { useAuth } from "app/auth";
import { Layout } from "components";
import { HomeView } from "containers";
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
    if (userData && !isLoading && !loggedIn) {
      dispatch(checkLoggedIn(userData));
    }
  }, [userData, isLoading, loggedIn]);

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
