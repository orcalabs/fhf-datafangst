import { Popper, styled } from "@mui/material";
import { autocompleteClasses } from "@mui/material/Autocomplete";

export const StyledPopper = styled(Popper)(({ theme }) => ({
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    maxHeight: 400,
  },
  [`& .${autocompleteClasses.option}`]: {
    borderBottom: "1px solid",
    borderColor: theme.palette.text.secondary,
    color: theme.palette.primary.dark,
    "& .MuiTypography-caption": { color: "grey" },
  },
  [`& .${autocompleteClasses.paper}`]: {
    borderRadius: 0,
    marginRight: "1px",
    marginLeft: "1px",
    color: theme.palette.primary.light,
  },
}));

export const StyledDatePopper = styled(Popper)(({ theme }) => ({
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    display: "flex",
    flexFlow: "row wrap",
  },
  [`& .${autocompleteClasses.option}`]: {
    flexBasis: "148px",
    margin: 1,
    borderColor: theme.palette.text.secondary,
    color: theme.palette.primary.dark,
    "& .MuiTypography-caption": { color: "grey" },
  },
  [`& .${autocompleteClasses.paper}`]: {
    width: "450px",
    borderRadius: 0,
    marginRight: "1px",
    marginLeft: "1px",
    color: theme.palette.primary.light,
  },
}));
