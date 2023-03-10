import { FC } from "react";
import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { kilosOrTonsFormatter, sumHaulCatches } from "utils";
import { HaulCatch } from "generated/openapi";
import { selectSpeciesFiskeridir, useAppSelector } from "store";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.text.secondary,
    borderColor: theme.palette.secondary.main,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "white",
    fontSize: "0.97rem",
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    "&:last-of-type": {
      color: "white",
      width: "33%",
      borderLeft: `1px solid ${theme.palette.primary.main}`,
    },
  },
  [`&.${tableCellClasses.footer}`]: {
    borderBottom: 0,
    fontSize: "0.97rem",
    fontWeight: "bold",
    color: "white",
    "&:last-of-type": { width: "33%" },
  },
}));

interface Props {
  catches: HaulCatch[];
}

export const CatchesTable: FC<Props> = (props) => {
  const { catches } = props;
  const fiskeridirSpecies = useAppSelector(selectSpeciesFiskeridir);

  if (catches.length === 0) {
    return (
      <Box sx={{ color: "white", px: 3 }}>
        <Typography> Ingen fangstdata </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Art</StyledTableCell>
            <StyledTableCell
              align="right"
              sx={{ "& .MuiBox-root": { justifyContent: "right" } }}
            >
              Rundvekt
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {catches.map((c, key) => (
            <TableRow
              key={key}
              sx={{
                "&:last-of-type td": {
                  borderBottom: "1px solid",
                  borderColor: "secondary.main",
                },
              }}
            >
              <StyledTableCell>
                {c.speciesFiskeridirId
                  ? fiskeridirSpecies[c.speciesFiskeridirId].name
                  : "Ukjent"}
              </StyledTableCell>
              <StyledTableCell align="right">
                {kilosOrTonsFormatter(c.livingWeight)}
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
        {catches.length > 1 && (
          <TableFooter>
            <TableRow>
              <StyledTableCell> Totalt: </StyledTableCell>
              <StyledTableCell align="right">
                {kilosOrTonsFormatter(sumHaulCatches(catches))}
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};
