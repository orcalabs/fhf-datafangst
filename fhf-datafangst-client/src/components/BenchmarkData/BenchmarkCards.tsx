import { FC, useEffect } from "react";

import Box from "@mui/material/Box";
import { BenchmarkCard } from "./BenchmarkCard";
import { selectTrips, useAppDispatch, useAppSelector } from "store";
import { Trips } from "components/MainMenu/Trips";
import { Grid } from "@mui/material";
import { BenchmarkModalParams, selectBenchmarkNumHistoric, setBenchmarkHistoric, setBenchmarkModal } from "store/benchmark";
import { Trip } from "generated/openapi";
import { BenchmarkModal } from "./BenchmarkModal";
import ScaleRoundedIcon from '@mui/icons-material/ScaleRounded';
import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhishingRoundedIcon from '@mui/icons-material/PhishingRounded';

const getTotalTimes = (trips: Trip[]) => {
  const totalTime: number[] = []
  trips.forEach((trip) => {
    totalTime.push(
      ((new Date(trip.end)).getTime() - (new Date(trip.start).getTime())) / (1000 * 3600 )
    )
  })
  return totalTime;
}

const getFishingHours = (trips: Trip[]) => {
  const fishingHours : number[] = []
  trips.forEach((trip) => {
    let fishing: number = 0;
    trip.hauls.map((haul) => {
      fishing += ((new Date(haul.stopTimestamp)).getTime() - (new Date(haul.startTimestamp).getTime())) / (1000 * 3600)
    })
    fishingHours.push(fishing)
  })
  return fishingHours
}

const getFishingDistance = (trips: Trip[]) => {
  const fishingDistance : number[] = []
  trips.forEach((trip) => {
    let fishing: number = 0;
    trip.hauls.map((haul) => {
      fishing += haul.haulDistance? haul.haulDistance : 0
    })
    fishingDistance.push(fishing)
  })
  return fishingDistance
}

const getFishingWeight = (trips: Trip[]) => {
  const fishingWeight : number[] = []
  trips.forEach((trip) => {
    fishingWeight.push(trip.delivery.totalGrossWeight)
  })
  return fishingWeight
}

const getTripDates = (trips: Trip[]) => {
  const dates : string[] = []
  trips.forEach((trip) => {
    dates.push(trip.start)
  })
  return dates
}

enum BenchmarkType{
  totalTime,
  fishingHours,
  fishingDistance,
  fishingWeight,
}

export const BenchmarkCards: FC= (props) => {  
  const dispatch = useAppDispatch()
  const trips = useAppSelector(selectTrips)
  const num_historic = useAppSelector(selectBenchmarkNumHistoric)
  let modal_title : string = '';
  if (!trips){
    return <></>
  }

  const totalTimes = getTotalTimes(trips)
  const fishingHours = getFishingHours(trips)
  const fishingDistance = getFishingDistance(trips)
  const fishingWeight = getFishingWeight(trips)
  const totalTimeMean =  totalTimes.reduce((a,b) => a+b,0) / totalTimes.length
  const fishingHoursMean =  fishingHours.reduce((a,b) => a+b,0) / fishingHours.length
  const fishingDistanceMean =  fishingDistance.reduce((a,b) => a+b,0) / fishingDistance.length
  const fishingWeightMean =  fishingWeight.reduce((a,b) => a+b,0) / fishingWeight.length


  const handleClick = (type: BenchmarkType) => {
    let benchmarkModal : BenchmarkModalParams = {};
    let data : number[];
    let metric: string;
    if (type === BenchmarkType.totalTime){
      benchmarkModal.title = "Total tid"
      benchmarkModal.description = "Total tid er regnet som tiden mellom havneavgang og havneanløp." 
      metric = "Timer"
      data = totalTimes
    } else if(type === BenchmarkType.fishingHours) {
      benchmarkModal.title = "Fiske tid"
      benchmarkModal.description = "Fiske tid er regnet som summen av tiden brukt under hver fangstmelding." 
      metric = "Timer"
      data = fishingHours
    } else if(type === BenchmarkType.fishingDistance){
      benchmarkModal.title = "Fiske distanse"
      benchmarkModal.description = "Fiske distanse er regnet ut basert på vms/ais meldingene som ble sendt under hver fangstmelding" 
      metric = "Meter"
      data = fishingDistance
    }else if(type === BenchmarkType.fishingWeight){
      benchmarkModal.title = "Total vekt"
      benchmarkModal.description = "Total vekt er basert på total landet vekt" 
      metric = "Kilo"
      data = fishingWeight
    }else {
      return
    }
    dispatch(setBenchmarkHistoric(
      [metric,getTripDates(trips),data]
    ))
    dispatch(setBenchmarkModal(benchmarkModal))
  }

  return (
    <Grid
    container
    spacing={3}
     sx={{marginTop:"3vh", backgroundColor: "primary.main" }}
   >
    <Grid item xs={6}>
      <Box>
        <BenchmarkCard title = "Total tid" 
          avatar={<AccessTimeIcon/>}
        value={
          totalTimes[0]
        } 
        description="Siste tur"
        primary_color={totalTimes[0] > totalTimeMean ? "#6CE16A": "#93032E"}
        secondary_value={
          totalTimeMean
        }
        secondary_description={"Gjennomsnitt siste " + num_historic + " turer"}
        metric="Timer"
        tooltip="Regnet ut basert på dine por og dep meldinger."
        onClick={() => handleClick(BenchmarkType.totalTime)}
        />
      </Box>
    </Grid>
    <Grid item xs={6}>
      <Box>
        <BenchmarkCard title = "Fiske tid" 
          avatar={<PhishingRoundedIcon/>}
          value={
            fishingHours[0]
          } 
          description="Siste tur"
          primary_color={fishingHours[0] > fishingHoursMean ? "#6CE16A": "#93032E"}

          secondary_value={
            fishingHours.reduce((a,b) => a+b,0) / fishingHours.length
          }
          secondary_description={"Gjennomsnitt siste " + num_historic + " turer"}
          metric="Timer"
          tooltip="Regnet ut basert på dine fangstmeldinger."
          onClick={() => handleClick(BenchmarkType.fishingHours)}
          />
      </Box>
    </Grid>
    <Grid item xs={6}>
      <Box>
        <BenchmarkCard title = "Fiske distanse" 
          avatar={<StraightenRoundedIcon/>}
          value={
            fishingDistance[0]
          } 
          description="Siste tur"
          primary_color={fishingDistance[0] > fishingDistanceMean ? "#6CE16A": "#93032E"}
          secondary_value={
            fishingDistance.reduce((a,b) => a+b,0) / fishingDistance.length
          }
          secondary_description={"Gjennomsnitt siste " + num_historic + " turer"}
          metric="Meter"
          tooltip="Regnet ut basert på dine fangstmeldinger."
          onClick={() => handleClick(BenchmarkType.fishingDistance)}
          />
      </Box>
    </Grid>
    <Grid item xs={6}>
      <Box>
        <BenchmarkCard title = "Total vekt" 
          avatar={<ScaleRoundedIcon/>}
          value={
            fishingWeight[0]
          } 
          description="Siste tur"
          primary_color={fishingWeight[0] > fishingWeightMean ? "#6CE16A": "#93032E"}
          secondary_value={
            fishingWeight.reduce((a,b) => a+b,0) / fishingWeight.length
          }
          secondary_description={"Gjennomsnitt siste " + num_historic + " turer"}
          metric="Kilo"
          tooltip="Data basert på levert vekt."
          onClick={() => handleClick(BenchmarkType.fishingWeight)}
          />
      </Box>
    </Grid>
    <BenchmarkModal/>
   </Grid>

  );
};
