import { Box } from "@mui/material";
import { Filters } from "components";
import { FC, useEffect } from "react";
import {
  initialHaulsMatrixSearch,
  setHaulsMatrixSearch,
  useAppDispatch,
} from "store";

export const CatchData: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setHaulsMatrixSearch({
        ...initialHaulsMatrixSearch,
        filter: undefined,
      }),
    );
  }, []);

  return (
    <Box sx={{ height: "100%", px: 2.5, py: 1 }}>
      <Filters />
    </Box>
  );
};
