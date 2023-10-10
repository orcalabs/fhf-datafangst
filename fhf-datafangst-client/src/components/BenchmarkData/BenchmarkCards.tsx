import { FC, useEffect } from "react";

import Box from "@mui/material/Box";
import { BenchmarkCard } from "./BenchmarkCard";
import { selectTrips, useAppSelector } from "store";
import { Trips } from "components/MainMenu/Trips";
import { Grid } from "@mui/material";


export const BenchmarkCards: FC= (props) => {

  
  const trips = useAppSelector(selectTrips)
  if (!trips){
    return <></>
  }
  const latest = trips[0];
  const prev = trips[1];
  

  return (
    <Grid
    container
    spacing={3}
    alignItems="center"
     sx={{ margin: "10vh", justifyContent: "center", backgroundColor: "primary.main" }}
   >
    <Grid item xs={3}>
      <Box>
        <BenchmarkCard title = "Total time" 
        value={
          ((new Date(latest.end)).getTime() - (new Date(latest.start).getTime())) / (1000 * 3600 * 24)
        } 
        description="Latest trip"
        secondary_value={
          ((new Date(prev.end)).getTime() - (new Date(prev.start).getTime())) / (1000 * 3600 * 24)
        }
        secondary_description="Previous trip"

        third_value={
          5
        }
        third_description="Avarage friend trips"
        metric="days"
        tooltip="Calculated based on your last por and dep message"
        />
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
