import SortIcon from "@mui/icons-material/Sort";
import {
  FormControl,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";

export interface SortOption<S, O> {
  label: string;
  value: [S, O];
}

export interface Props<S, O> {
  value: [S, O];
  options: SortOption<S, O>[];
  onChange: (sorting: S, ordering: O) => void;
}

export const SortMenu = <S, O>({ value, options, onChange }: Props<S, O>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [sorting, ordering] = value;

  return (
    <>
      <span>
        <IconButton
          sx={{ mr: 3, py: 0 }}
          size="small"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <SortIcon sx={{ color: "white" }} />
        </IconButton>
      </span>

      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem>
          <FormControl
            sx={{
              "& .MuiButtonBase-root": {
                "&:hover": { borderRadius: 0 },
              },
            }}
          >
            <RadioGroup
              defaultValue="female"
              name="radio-sorting"
              value={`${sorting},${ordering}`}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onChange(
                  ...((event.target as HTMLInputElement).value.split(",") as [
                    S,
                    O,
                  ]),
                )
              }
            >
              {options.map(({ label, value: [sorting, ordering] }) => (
                <FormControlLabel
                  key={label}
                  label={label}
                  value={`${sorting},${ordering}`}
                  control={<Radio />}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </MenuItem>
      </Menu>
    </>
  );
};
