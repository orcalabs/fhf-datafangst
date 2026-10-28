import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  MenuItem,
  Select,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useMemo, type FC } from "react";
import theme from "~/app/theme";
import type { PerVesselStats } from "~/generated/openapi";
import { VesselRankingType } from "~/models";
import {
  selectAvgVesselBenchmark,
  selectLoggedInVessel,
  selectSumPerVesselBenchmarkLoading,
  selectVesselRankingKpi,
  selectVesselRankingType,
  selectVesselsByFiskeridirId,
  setVesselRankingKpi,
  setVesselRankingType,
  useAppDispatch,
  useAppSelector,
} from "~/store";
import { formatNumber, toTitleCase } from "~/utils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.root}`]: {
    padding: "10px 6px",
    fontSize: "0.87rem",
    paddingLeft: 16,
    paddingRight: 16,
  },
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.grey[700],
    fontWeight: "bold",
    "&:first-of-type": {
      width: 60,
      marginRight: 5,
    },
    "&:last-of-type": {
      paddingRight: 0,
    },
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: "0.9rem",
  },
  [`&.${tableCellClasses.footer}`]: {
    borderBottom: 0,
    fontWeight: "bold",
    color: "white",
    "&:last-of-type": { width: "33%" },
  },
}));

const kpis: {
  value: keyof PerVesselStats;
  label: string;
}[] = [
  { value: "livingWeight", label: "Rundvekt (kg)" },
  { value: "weightPerHour", label: "Fangst per dag (kg/dag)" },
  { value: "weightPerDistance", label: "Fangst per distanse (kg/nm)" },
  { value: "fuelConsumptionLiter", label: "Drivstofforbruk (liter)" },
  { value: "weightPerFuelLiter", label: "Fangst per liter drivstoff (kg/l)" },
  {
    value: "catchValuePerFuelLiter",
    label: "Fangstverdi per liter drivstoff (kr/l)",
  },
];

export const VesselRanking: FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectSumPerVesselBenchmarkLoading);
  const vessels = useAppSelector(selectVesselsByFiskeridirId);
  const vesselStats = useAppSelector(selectAvgVesselBenchmark);
  const loggedInVessel = useAppSelector(selectLoggedInVessel);
  const vesselRankingType = useAppSelector(selectVesselRankingType);
  const selectedKpi = useAppSelector(selectVesselRankingKpi);

  const data = useMemo(
    () =>
      vesselStats
        ? [...vesselStats.perVessel].sort(
            (a, b) => (b[selectedKpi] ?? 0) - (a[selectedKpi] ?? 0),
          )
        : [],
    [vesselStats, selectedKpi],
  );

  const myRank = data?.findIndex(
    (v) => v.fiskeridirVesselId === loggedInVessel?.fiskeridir.id,
  );

  const myVesselStats = vesselStats?.perVessel.find(
    (v) => v.fiskeridirVesselId === loggedInVessel?.fiskeridir.id,
  );

  return (
    <Card
      variant="elevation"
      sx={{
        maxHeight: "calc(100dvh - 270px)",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            pt: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <CardHeader
            action={
              <ToggleButtonGroup
                value={vesselRankingType}
                exclusive
                onChange={(_, value: VesselRankingType) => {
                  if (value !== null) {
                    dispatch(setVesselRankingType(value));
                  }
                }}
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    textTransform: "none",
                    fontSize: "0.88rem",
                    width: 90,
                    height: 35,
                    "&.Mui-selected": {
                      fontWeight: "bold",
                      bgcolor: "#1b79c5",
                      color: "white",
                      ":hover": {
                        bgcolor: "#1b79c5",
                      },
                    },
                  },
                  "& .MuiToggleButton-root:first-of-type": {
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  },
                  "& .MuiToggleButton-root:last-of-type": {
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  },
                }}
              >
                <ToggleButton value={VesselRankingType.Similar}>
                  Lignende
                </ToggleButton>
                <ToggleButton value={VesselRankingType.Following}>
                  Følgeliste
                </ToggleButton>
              </ToggleButtonGroup>
            }
            avatar={
              <EmojiEventsIcon fontSize="large" sx={{ color: "#F2C94C" }} />
            }
            title={"Topp fartøy"}
            sx={{
              flexShrink: 0,
              p: 2.5,
              pr: 4,
            }}
            slotProps={{
              title: {
                sx: {
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                },
              },
              action: {
                sx: {
                  mt: 0,
                },
              },
            }}
          />
          <CardContent
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              pt: 0,
              px: 3,
            }}
          >
            {data.length > 0 ? (
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>Fartøy</StyledTableCell>
                    <StyledTableCell align="right">
                      <Select
                        value={selectedKpi}
                        onChange={(event) =>
                          dispatch(
                            setVesselRankingKpi(
                              event.target.value as keyof PerVesselStats,
                            ),
                          )
                        }
                        size="small"
                        sx={{
                          color: theme.palette.grey[700],
                          fontWeight: "bold",
                          fontSize: "0.87rem",
                        }}
                      >
                        {kpis.map((kpi) => (
                          <MenuItem key={kpi.value} value={kpi.value}>
                            {kpi.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((vessel, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        borderRadius: 2,
                        bgcolor:
                          vessel.fiskeridirVesselId ===
                          loggedInVessel?.fiskeridir.id
                            ? "#e6f8e5"
                            : "inherit",
                      }}
                    >
                      <StyledTableCell>{i + 1}</StyledTableCell>
                      <StyledTableCell>
                        {toTitleCase(
                          vessels[vessel.fiskeridirVesselId].fiskeridir.name,
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {vessel[selectedKpi] != null
                          ? formatNumber(
                              selectedKpi === "weightPerHour"
                                ? vessel[selectedKpi] * 24
                                : vessel[selectedKpi],
                              0,
                            )
                          : "–"}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography
                sx={{
                  p: 1,
                  pt: 2,
                  color: theme.palette.grey.A100,
                  fontStyle: "italic",
                }}
              >
                {vesselRankingType === VesselRankingType.Following
                  ? "Du har ingen fartøy i din følgeliste."
                  : "Fant ingen sammenlignbare fartøy"}
              </Typography>
            )}
          </CardContent>
          {data.length > 0 && (
            <CardActions
              sx={{
                p: 0,
                width: "100%",
                bgcolor: "grey",
                borderRadius: "0 0 8px 8px",
                overflow: "hidden",
                flexShrink: 0,
                borderTop: `2px solid rgba(200, 200, 200, 1)`,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  p: 2,
                  bgcolor: "#cfddeb",
                }}
              >
                {myRank !== undefined && myRank >= 0 ? (
                  <Stack
                    direction="row"
                    spacing={5}
                    sx={{ px: 2.5, width: "100%" }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      {myRank + 1}
                    </Typography>
                    <Typography sx={{ flex: 1, fontWeight: "bold" }}>
                      {loggedInVessel?.fiskeridir.name}
                    </Typography>
                    <Typography sx={{ ml: "auto", fontWeight: "bold" }}>
                      {myVesselStats && myVesselStats[selectedKpi] != null
                        ? formatNumber(
                            selectedKpi === "weightPerHour"
                              ? myVesselStats[selectedKpi]! * 24
                              : myVesselStats[selectedKpi]!,
                            0,
                          )
                        : "–"}
                    </Typography>
                  </Stack>
                ) : (
                  <Typography>Ikke rangert</Typography>
                )}
              </Box>
            </CardActions>
          )}
        </>
      )}
    </Card>
  );
};
