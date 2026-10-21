import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
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
  Typography,
} from "@mui/material";
import { useMemo, useState, type FC } from "react";
import theme from "~/app/theme";
import type { SumVesselBenchmark } from "~/generated/openapi";
import {
  selectLoggedInVessel,
  selectSumPerVesselBenchmark,
  selectSumPerVesselBenchmarkLoading,
  selectVesselsByFiskeridirId,
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
  value: keyof SumVesselBenchmark;
  label: string;
}[] = [
  { value: "sumLivingWeight", label: "Rundvekt (kg)" },
  { value: "averageWeightPerHour", label: "Fangst per dag (kg/dag)" },
  { value: "averageWeightPerDistance", label: "Fangst per distanse (kg/nm)" },
];

export const VesselRanking: FC = () => {
  const vesselStats = useAppSelector(selectSumPerVesselBenchmark);
  const isLoading = useAppSelector(selectSumPerVesselBenchmarkLoading);
  const vessels = useAppSelector(selectVesselsByFiskeridirId);

  const loggedInVessel = useAppSelector(selectLoggedInVessel);
  const [selectedKpi, setSelectedKpi] =
    useState<keyof SumVesselBenchmark>("sumLivingWeight");

  const data = useMemo(
    () =>
      vesselStats
        ? [...vesselStats].sort(
            (a, b) => (b[selectedKpi] ?? 0) - (a[selectedKpi] ?? 0),
          )
        : [],
    [vesselStats, selectedKpi],
  );

  const myRank = data?.findIndex(
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
            avatar={
              <EmojiEventsIcon fontSize="large" sx={{ color: "#F2C94C" }} />
            }
            title={"Topp lignende fartøy"}
            sx={{
              flexShrink: 0,
              p: 2.5,
            }}
            slotProps={{
              title: {
                sx: {
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                },
              },
            }}
          />

          <Divider
            sx={{ mb: 1, mx: 2.5, bgcolor: "rgba(200, 200, 200, 0.7)" }}
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
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>#</StyledTableCell>
                  <StyledTableCell>Fartøy</StyledTableCell>
                  <StyledTableCell align="right">
                    <Select
                      variant="standard"
                      value={selectedKpi}
                      onChange={(event) =>
                        setSelectedKpi(
                          event.target.value as keyof SumVesselBenchmark,
                        )
                      }
                      disableUnderline
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
                            selectedKpi === "averageWeightPerHour"
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
          </CardContent>
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
                    {data?.[myRank].sumLivingWeight?.toFixed(0)}
                  </Typography>
                </Stack>
              ) : (
                <Typography>Ikke rangert</Typography>
              )}
            </Box>
          </CardActions>
        </>
      )}
    </Card>
  );
};
