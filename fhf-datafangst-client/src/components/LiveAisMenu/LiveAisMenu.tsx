import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListSubheader,
} from "@mui/material";
import { VesselIcon } from "assets/icons";
import { LocalLoadingProgress, PaginationButtons } from "components";
import { TripItem } from "components/MainMenu/TripItem";
import { VesselDetails } from "components/TripDetails/VesselDetails";
import { FC, useEffect, useMemo, useState } from "react";
import {
  getTrips,
  selectSelectedLivePosition,
  selectTrips,
  selectTripsLoading,
  selectVesselByMmsi,
  useAppDispatch,
  useAppSelector,
} from "store";
import { toTitleCase } from "utils";
import { Header } from "./Header";

export const LiveAisMenu: FC = () => {
  const dispatch = useAppDispatch();

  const position = useAppSelector(selectSelectedLivePosition)!;
  const vessel = useAppSelector((state) =>
    selectVesselByMmsi(state, position.mmsi),
  )!;
  const trips = useAppSelector(selectTrips);
  const tripsLoading = useAppSelector(selectTripsLoading);

  const [params, setParams] = useState({ limit: 10, offset: 0 });

  useEffect(() => {
    dispatch(getTrips({ vessels: [vessel], ...params }));
  }, [vessel, params]);

  const owner = useMemo(
    () =>
      vessel.fiskeridir.owners.length > 0
        ? vessel.fiskeridir.owners.map((v) => toTitleCase(v.name)).join(",")
        : "Ukjent eier",
    [vessel],
  );

  if (!position) {
    return <></>;
  }

  return (
    <>
      <Accordion disableGutters square elevation={0}>
        <AccordionSummary
          sx={{
            color: "white",
            bgcolor: "primary.light",
            pl: 2.5,
            pr: 2,
          }}
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Header
              title={vessel.fiskeridir.name ?? vessel.ais?.name ?? "Ukjent"}
              subtitle={owner}
              Icon={VesselIcon}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ bgcolor: "primary.light", pb: 0, px: 4 }}>
          <VesselDetails vesselId={vessel.fiskeridir.id} color="white" />
        </AccordionDetails>
      </Accordion>

      <List sx={{ color: "white", pt: 0 }}>
        <ListSubheader
          sx={{
            bgcolor: "primary.light",
            pl: 2.5,
          }}
        >
          Leveranser
        </ListSubheader>

        {tripsLoading ? (
          <Box sx={{ pt: 2, pl: 2.5 }}>
            <LocalLoadingProgress />
          </Box>
        ) : !trips?.length && params.offset === 0 ? (
          <Box sx={{ py: 1, pl: 2.5 }}>Ingen leveranser</Box>
        ) : (
          <>
            {trips?.map((t) => <TripItem key={t.tripId} trip={t} />)}

            <Box sx={{ mt: 1 }}>
              <PaginationButtons
                numItems={trips?.length ?? 0}
                offset={params.offset}
                limit={params.limit}
                onPaginationChange={(offset, limit) =>
                  setParams({ limit, offset })
                }
              />
            </Box>
          </>
        )}
      </List>
    </>
  );
};
