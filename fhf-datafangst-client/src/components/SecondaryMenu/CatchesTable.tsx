import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
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
import { Catch, CatchWeightType } from "models";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { selectSpeciesFiskeridirMap, useAppSelector } from "store";
import { kilosOrTonsFormatter, sumCatches, sumPriceFromCatches } from "utils";

type SortFn = (a: Catch, b: Catch) => number;

const weightAsc =
  (weight: CatchWeightType) =>
  (a: Catch, b: Catch): number =>
    (a[weight] ?? 0) - (b[weight] ?? 0);

const weightDesc =
  (weight: CatchWeightType) =>
  (a: Catch, b: Catch): number =>
    (b[weight] ?? 0) - (a[weight] ?? 0);

const priceAsc = (a: Catch, b: Catch): number =>
  (a.priceForFisher ?? 0) - (b.priceForFisher ?? 0);
const priceDesc = (a: Catch, b: Catch): number =>
  (b.priceForFisher ?? 0) - (a.priceForFisher ?? 0);

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
    label: "Prod.vekt",
    asc: weightAsc("productWeight"),
    desc: weightDesc("productWeight"),
    weightType: "productWeight" as CatchWeightType,
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.root}`]: {
    width: "100%",
    padding: "6px 10px",
  },
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.text.secondary,
    borderColor: theme.palette.secondary.light,
    fontWeight: "bold",
    "&:last-of-type": {
      minWidth: 120,
    },
  },
  [`&.${tableCellClasses.body}`]: {
    border: 0,
    color: "white",
    fontSize: "0.97rem",
    borderBottom: `1px solid ${theme.palette.primary.light}`,
    "&:last-of-type": {
      color: "white",
      width: "33%",
      borderLeft: `1px solid ${theme.palette.primary.light}`,
    },
    "&:first-of-type": {
      maxWidth: 130,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
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
  const nok = new Intl.NumberFormat("no-NB", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  });

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
      {hasPrice && Number.isFinite(c.priceForFisher) && (
        <StyledTableCell align="right">
          {nok.format(c.priceForFisher!)}
        </StyledTableCell>
      )}
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
  const hasPrice = catches.some(
    (c) => c.priceForFisher !== null && c.priceForFisher !== undefined,
  );

  return (
    <TableContainer
      sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              {headerCell("Art", speciesAsc, speciesDesc)}
            </StyledTableCell>
            {hasPrice && (
              <StyledTableCell
                align="right"
                sx={{ "& .MuiBox-root": { justifyContent: "right" } }}
              >
                {headerCell("Pris", priceAsc, priceDesc)}
              </StyledTableCell>
            )}
            <StyledTableCell
              align="right"
              sx={{
                "& .MuiBox-root": { justifyContent: "right" },
                cursor: showWeightTypes ? "pointer" : "cursor",
              }}
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
              {hasPrice && (
                <StyledTableCell align="right">
                  {nok.format(sumPriceFromCatches(catches))}
                </StyledTableCell>
              )}
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
