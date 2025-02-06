import { SvgIconComponent } from "@mui/icons-material";
import AllInclusiveSharpIcon from "@mui/icons-material/AllInclusiveSharp";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ListItemText,
  SvgIcon,
  Typography,
} from "@mui/material";
import theme from "app/theme";
import { FishIcon } from "assets/icons";
import { CatchesTable } from "components";
import { Catch } from "models";
import { FC } from "react";

const accordionSx = {
  m: 0,
  py: 1,
  px: 2.5,
  color: "white",
  boxShadow: "none",
  bgcolor: "primary.light",
  "&.Mui-expanded": {
    m: 0,
    bgcolor: "primary.dark",
    "&:hover": { bgcolor: "primary.dark" },
  },
  "& .MuiAccordionSummary-root": { p: 0 },
  "& .MuiAccordionSummary-content": { m: 0 },

  "&:hover": { bgcolor: "primary.dark" },
  "&:before": { display: "none" },
};

export interface ListItemDetail {
  Icon: SvgIconComponent;
  text: string;
}

export interface Props {
  key: any;
  selected: boolean;
  title: string;
  subtitle: string;
  expandedDetails: ListItemDetail[];
  catches: Catch[];
  onSelect: () => void;
  onTripClick: () => void;
}

export const ListItem: FC<Props> = ({
  selected,
  title,
  subtitle,
  expandedDetails,
  catches,
  onSelect,
  onTripClick,
}) => {
  return (
    <Accordion
      square
      disableGutters
      sx={accordionSx}
      expanded={selected}
      onChange={onSelect}
    >
      <AccordionSummary>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "& svg": { mr: 2 },
          }}
        >
          <FishIcon
            width="48"
            height="48"
            fill={`${theme.palette.secondary.light}`}
          />
        </Box>
        <ListItemText primary={title} secondary={subtitle} />
      </AccordionSummary>
      <AccordionDetails sx={{ pb: 0 }}>
        {selected && (
          <Box sx={{ py: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                "& svg": { mr: 2 },
              }}
            >
              {expandedDetails.map(({ Icon, text }, i) => (
                <Box key={i} sx={{ display: "flex", gap: 2 }}>
                  <SvgIcon sx={{ position: "relative", color: "white" }}>
                    <Icon width={20} height={20} />
                  </SvgIcon>
                  <Typography sx={{ color: "white" }}>{text}</Typography>
                </Box>
              ))}
            </Box>
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                mt: 3,
              }}
            >
              Estimert fangst
            </Typography>
            <CatchesTable catches={catches} />
            <Button
              size="small"
              sx={{
                width: "100%",
                bgcolor: "secondary.main",
                px: 2,
                borderRadius: 0,
                mt: 1,
              }}
              onClick={onTripClick}
              startIcon={<AllInclusiveSharpIcon sx={{ color: "white" }} />}
            >
              <Typography sx={{ pl: 1, color: "white" }}> Vis tur </Typography>
            </Button>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
