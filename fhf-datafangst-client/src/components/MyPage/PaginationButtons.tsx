import { FC } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Button, MenuItem, Select } from "@mui/material";

export const PaginationButton = (props: any) => (
  <Button
    variant="contained"
    size="small"
    sx={{
      borderRadius: 0,
      m: 1,
      bgcolor: props.bgcolor ?? "primary.main",
      color: "white",
      "&:hover": { bgcolor: "primary.dark" },
    }}
    disableElevation
    {...props}
  ></Button>
);

interface Props {
  numItems: number;
  offset: number;
  limit: number;
  onPaginationChange: (offset: number, limit: number) => void;
}

export const PaginationButtons: FC<Props> = (props) => {
  const { numItems, offset, limit, onPaginationChange } = props;

  const onChange = (offset: number, limit: number) =>
    onPaginationChange(offset < 0 ? 0 : offset, limit);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
      {!((!numItems && offset > 0) || numItems < limit) && (
        <PaginationButton
          startIcon={<ArrowBackIosIcon color="secondary" />}
          onClick={() => onChange(offset + limit, limit)}
        >
          Vis eldre
        </PaginationButton>
      )}
      {!(numItems === 0 && offset === 0) && (
        <Select
          sx={{
            height: "1.5rem",
            width: "5rem",
            margin: "auto",
            gridColumn: 2,
            borderRadius: 0,
            border: 0,
            "&, *": {
              color: "white",
              borderColor: "primary.main",
              fontSize: "0.875rem",
            },
            "& .MuiSvgIcon-root": {
              fontSize: "1.5rem",
            },
            "&:hover": {
              bgcolor: "primary.main",
            },
            "&.Mui-focused": {
              bgcolor: "primary.main",
            },
          }}
          value={limit.toString()}
          onChange={(event: any) => onChange(offset, +event.target.value)}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
        </Select>
      )}
      {Boolean(offset) && (
        <Box sx={{ mr: 0, ml: "auto", gridColumn: 3 }}>
          <PaginationButton
            endIcon={<ArrowForwardIosIcon color="secondary" />}
            onClick={() => onChange(offset - limit, limit)}
          >
            Vis nyere
          </PaginationButton>
        </Box>
      )}
    </Box>
  );
};
