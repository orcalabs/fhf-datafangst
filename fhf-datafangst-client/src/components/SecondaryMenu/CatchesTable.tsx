import { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import { kilosOrTonsFormatter, sumCatches } from "utils";
import { selectSpeciesFiskeridirMap, useAppSelector } from "store";
import { Catch, CatchWeightType } from "models";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type SortFn = (a: Catch, b: Catch) => number;

const weightAsc =
  (weight: CatchWeightType) =>
  (a: Catch, b: Catch): number =>
    (a[weight] ?? 0) - (b[weight] ?? 0);

const weightDesc =
  (weight: CatchWeightType) =>
  (a: Catch, b: Catch): number =>
    (b[weight] ?? 0) - (a[weight] ?? 0);

const weightTypes = [
  {
    label: "Rundvekt",
    asc: weightAsc("livingWeight"),
    desc: weightDesc("livingWeight"),
    weightType: "livingWeight" as CatchWeightType,
  },
  {
    label: "Bruttovekt",
    asc: weightAsc("grossWeight"),
    desc: weightDesc("grossWeight"),
    weightType: "grossWeight" as CatchWeightType,
  },
  {
    label: "Produktvekt",
    asc: weightAsc("productWeight"),
    desc: weightDesc("productWeight"),
    weightType: "productWeight" as CatchWeightType,
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.text.secondary,
    borderColor: theme.palette.secondary.light,
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
  catches: Catch[];
}

export const CatchesTable: FC<Props> = (props) => {
  const catches = useMemo(() => [...props.catches], [props.catches]);
  const fiskeridirSpecies = useAppSelector(selectSpeciesFiskeridirMap);

  const speciesAsc = useMemo(
    () =>
      (a: Catch, b: Catch): number => {
        const nameA = fiskeridirSpecies[a.speciesFiskeridirId].name;
        const nameB = fiskeridirSpecies[b.speciesFiskeridirId].name;

        if (!nameA || !nameB) {
          return 0;
        }

        return nameB.localeCompare(nameA, "no");
      },
    [],
  );

  const speciesDesc = useMemo(
    () =>
      (a: Catch, b: Catch): number => {
        const nameA = fiskeridirSpecies[a.speciesFiskeridirId].name;
        const nameB = fiskeridirSpecies[b.speciesFiskeridirId].name;

        if (!nameA || !nameB) {
          return 0;
        }

        return nameA.localeCompare(nameB, "no");
      },
    [],
  );

  const computeWeightType = useCallback(
    () =>
      catches.reduce((sum, curr) => sum + curr.livingWeight, 0) > 0
        ? 0
        : catches.reduce((sum, curr) => sum + (curr.grossWeight ?? 0), 0) > 0
          ? 1
          : 2,
    [catches],
  );

  const [sortFn, setSortFn] = useState<SortFn>(() => speciesDesc);
  const [weightTypeIdx, setWeightTypeIdx] = useState(computeWeightType);

  useEffect(() => setWeightTypeIdx(computeWeightType()), [computeWeightType]);

  if (catches.length === 0) {
    return (
      <Box sx={{ color: "white", px: 3 }}>
        <Typography> Ingen fangstdata </Typography>
      </Box>
    );
  }

  catches.sort(sortFn);

  const catchRow = (c: Catch, key: number, weightType: CatchWeightType) => (
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
        {fiskeridirSpecies[c.speciesFiskeridirId].name}
      </StyledTableCell>
      <StyledTableCell align="right">
        {kilosOrTonsFormatter(c[weightType] ?? 0)}
      </StyledTableCell>
    </TableRow>
  );

  const headerCell = (
    title: string,
    asc: SortFn,
    desc: SortFn,
    onClick?: () => void,
  ) => {
    return (
      <Box sx={{ display: "flex" }}>
        {onClick ? (
          <Box className="hover" onClick={onClick}>
            {title}
          </Box>
        ) : (
          title
        )}
        <Box
          sx={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            mt: "-4px",
          }}
        >
          <ArrowDropUpIcon
            sx={{ visibility: sortFn === asc ? "hidden" : "" }}
            onClick={() => setSortFn(() => asc)}
          />
          <ArrowDropDownIcon
            sx={{ mt: "-16px", visibility: sortFn === desc ? "hidden" : "" }}
            onClick={() => setSortFn(() => desc)}
          />
        </Box>
      </Box>
    );
  };

  const showWeightTypes = catches[0]?.grossWeight !== undefined;
  const currentWeightType = weightTypes[weightTypeIdx];

  return (
    <TableContainer
      sx={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              {headerCell("Art", speciesAsc, speciesDesc)}
            </StyledTableCell>
            <StyledTableCell
              align="right"
              sx={{ "& .MuiBox-root": { justifyContent: "right" } }}
            >
              {headerCell(
                currentWeightType.label,
                currentWeightType.asc,
                currentWeightType.desc,
                showWeightTypes
                  ? () =>
                      setWeightTypeIdx((weightTypeIdx + 1) % weightTypes.length)
                  : undefined,
              )}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {catches.map((c, key) =>
            catchRow(c, key, currentWeightType.weightType),
          )}
        </TableBody>
        {catches.length > 1 && (
          <TableFooter>
            <TableRow>
              <StyledTableCell> Totalt: </StyledTableCell>
              <StyledTableCell align="right">
                {kilosOrTonsFormatter(
                  sumCatches(catches, currentWeightType.weightType),
                )}
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};
