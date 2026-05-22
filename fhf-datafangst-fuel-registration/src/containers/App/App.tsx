import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { useAuth } from "~/app/auth";
import { Layout } from "~/components";
import { HomeView } from "~/containers";
import {
  checkLoggedIn,
  getVessels,
  selectIsLoggedIn,
  useAppDispatch,
  useAppSelector,
} from "~/store";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData, isLoading } = useAuth();
  const loggedIn = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (userData && !isLoading) {
      dispatch(checkLoggedIn(userData));
    }
  }, [userData, isLoading]);

  useEffect(() => {
    dispatch(getVessels());
  }, []);

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
