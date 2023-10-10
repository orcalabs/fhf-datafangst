import { FC, useEffect } from "react";

import Box from "@mui/material/Box";
import { BenchmarkCard } from "./BenchmarkCard";
import { selectTrips, useAppSelector } from "store";
import { Trips } from "components/MainMenu/Trips";
import { Grid } from "@mui/material";

export const BenchmarkCards: FC = (props) => {
  const trips = useAppSelector(selectTrips);

  return (
    <Grid
    container
    spacing={3}
    alignItems="center"
     sx={{ margin: "10vh", justifyContent: "center", backgroundColor: "primary.main" }}
   >
    <Grid item xs={3}>
      <Box>
        <BenchmarkCard title = "Total time" value={450} secondary_value={337}/>
      </Box>
    </Grid>
    <Grid item xs={3}>
      <Box>
        <BenchmarkCard title = "Total distance" value={450} secondary_value={337}/>
      </Box>
    </Grid>
    <Grid item xs={3}>
      <Box>
        <BenchmarkCard title = "Total fuel" value={450} secondary_value={337}/>
      </Box>
    </Grid>
   </Grid>
  );
};
