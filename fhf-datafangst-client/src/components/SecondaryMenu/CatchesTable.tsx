import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  Box,
  Stack,
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
import { SpeciesFiskeridir } from "generated/openapi";
import { Catch, CatchWeightType } from "models";
import { FC, useEffect, useMemo, useState } from "react";
import { selectSpeciesFiskeridirMap, useAppSelector } from "store";
import {
  kilosOrTonsFormatter,
  reduceCatchesOnSpecies,
  sumCatches,
  sumPriceFromCatches,
} from "utils";

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

const _speciesAsc =
  (speciesMap: Record<number, SpeciesFiskeridir>) =>
  (a: Catch, b: Catch): number => {
    const nameA = speciesMap[a.speciesFiskeridirId].name;
    const nameB = speciesMap[b.speciesFiskeridirId].name;

    if (!nameA && !nameB) return 0;
    else if (!nameA) return -1;
    else if (!nameB) return 1;

    return nameA.localeCompare(nameB, "no");
  };

const _speciesDesc =
  (speciesMap: Record<number, SpeciesFiskeridir>) =>
  (a: Catch, b: Catch): number => {
    const nameA = speciesMap[a.speciesFiskeridirId].name;
    const nameB = speciesMap[b.speciesFiskeridirId].name;

    if (!nameA && !nameB) return 0;
    else if (!nameB) return -1;
    else if (!nameA) return 1;

    return nameB.localeCompare(nameA, "no");
  };

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
    padding: "6px 6px",
    fontSize: "0.87rem",
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
    fontWeight: "bold",
    color: "white",
    "&:last-of-type": { width: "33%" },
  },
}));

const nok = new Intl.NumberFormat("no-NB", {
  style: "currency",
  currency: "NOK",
  maximumFractionDigits: 0,
});

interface Props {
  catches: Catch[];
  isEstimatedValue?: boolean;
}

export const CatchesTable: FC<Props> = ({
  catches: _catches,
  isEstimatedValue,
}) => {
  const fiskeridirSpecies = useAppSelector(selectSpeciesFiskeridirMap);

  const [speciesAsc, speciesDesc] = useMemo(
    () => [_speciesAsc(fiskeridirSpecies), _speciesDesc(fiskeridirSpecies)],
    [fiskeridirSpecies],
  );

  const [sortFn, setSortFn] = useState<SortFn>(() => speciesAsc);

  const reducedCatches = useMemo(
    () => Object.values(reduceCatchesOnSpecies(_catches)),
    [_catches],
  );

  const catches = useMemo(
    () => reducedCatches.sort(sortFn),
    [reducedCatches, sortFn],
  );

  const initialWeightType = useMemo(
    () =>
      catches.sum((v) => v.livingWeight) > 0
        ? 0
        : catches.sum((v) => v.grossWeight ?? 0) > 0
          ? 1
          : 2,
    [catches],
  );

  const [weightTypeIdx, setWeightTypeIdx] = useState(initialWeightType);

  useEffect(() => setWeightTypeIdx(initialWeightType), [initialWeightType]);

  if (catches.length === 0) {
    return (
      <Box sx={{ color: "white", px: 3 }}>
        <Typography> Ingen fangstdata </Typography>
      </Box>
    );
  }

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
        <StyledTableCell
          align="right"
          title={`${c[weightType] && c.priceForFisher ? (c.priceForFisher! / c[weightType]!).toFixed(1) : 0} kr/kg ${isEstimatedValue ? "*" : ""}`}
        >
          {nok.format(c.priceForFisher!)}
          {isEstimatedValue && <StarText />}
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
    <Stack sx={{ width: "100%" }} spacing={1.5}>
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
                  {headerCell("Verdi", priceAsc, priceDesc)}
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
                        setWeightTypeIdx(
                          (weightTypeIdx + 1) % weightTypes.length,
                        )
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
                    {isEstimatedValue && <StarText />}
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
      {isEstimatedValue && (
        <Typography sx={{ color: "text.secondary" }} variant="subtitle2">
          <Box
            component="span"
            sx={{ color: "fifth.main", fontWeight: "bold" }}
          >
            *{" "}
          </Box>
          Verdi estimert fra ukentlig salgsdata (Råfisklaget)
        </Typography>
      )}
    </Stack>
  );
};

const StarText: FC = () => {
  return (
    <Box
      component="span"
      sx={{ pl: "3px", color: "fifth.main", fontWeight: "bold" }}
    >
      *
    </Box>
  );
};
