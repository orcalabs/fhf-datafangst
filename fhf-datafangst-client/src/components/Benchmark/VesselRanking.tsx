import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
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
import { type FC } from "react";
import type { SumVesselBenchmark } from "~/generated/openapi";
import {
  selectLoggedInVessel,
  selectSumPerVesselBenchmark,
  selectSumPerVesselBenchmarkLoading,
  selectVesselsByFiskeridirId,
  useAppSelector,
} from "~/store";
import { toTitleCase } from "~/utils";

interface Props {}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.root}`]: {
    padding: "10px 6px",
    fontSize: "0.87rem",
  },
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.grey[700],
    fontWeight: "bold",
    "&:first-of-type": {
      width: 60,
      marginRight: 5,
    },
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
  },
  [`&.${tableCellClasses.footer}`]: {
    borderBottom: 0,
    fontWeight: "bold",
    color: "white",
    "&:last-of-type": { width: "33%" },
  },
}));

export const VesselRanking: FC<Props> = () => {
  const vesselStats = useAppSelector(selectSumPerVesselBenchmark);
  const isLoading = useAppSelector(selectSumPerVesselBenchmarkLoading);
  const vessels = useAppSelector(selectVesselsByFiskeridirId);

  const loggedInVessel = useAppSelector(selectLoggedInVessel);

  const sortByValue = (
    parameter: keyof SumVesselBenchmark,
  ): SumVesselBenchmark[] | undefined => {
    if (vesselStats) {
      return [...vesselStats].sort(
        (a, b) => (b[parameter] ?? 0) - (a[parameter] ?? 0),
      );
    }
  };

  const data = sortByValue("sumLivingWeight");

  const myRank = data?.findIndex(
    (v) => v.fiskeridirVesselId === loggedInVessel?.fiskeridir.id,
  );
  console.log(data, myRank);
  return (
    <Card
      variant="elevation"
      sx={{
        height: "95%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        // m: "auto",
        // bgcolor: "white",
        // borderRadius: 2,
        // width: "100%",
        mt: 3,
        // height: "50%",
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
              borderBottom: `1px solid rgba(200, 200, 200, 1)`,
              // bgcolor: "rgba(224, 224, 224, 1)",
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

          <CardContent
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">#</StyledTableCell>
                  <StyledTableCell>Fartøy</StyledTableCell>
                  <StyledTableCell align="right">Verdi</StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((vessel, i) => (
                  <TableRow key={i}>
                    <StyledTableCell align="center">{i + 1}</StyledTableCell>
                    {/* TODO: Change ! when api supports it */}
                    <StyledTableCell>
                      {toTitleCase(
                        vessels[vessel.fiskeridirVesselId!].fiskeridir.name,
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {vessel.sumLivingWeight?.toFixed(0)}
                    </StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* {test.map((vessel, i) => (
          <Stack direction="row" spacing={6}>
            <Typography>{i + 1}</Typography>
            <Typography>{vessel.name}</Typography>
            <Typography>{vessel.value}</Typography>
          </Stack>
        ))} */}
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
                bgcolor: "grey.300",
              }}
            >
              {myRank && myRank > 0 ? (
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
