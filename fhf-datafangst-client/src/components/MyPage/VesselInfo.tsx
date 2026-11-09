import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeightIcon from "@mui/icons-material/Height";
import PhishingSharpIcon from "@mui/icons-material/PhishingSharp";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { FC, ReactNode } from "react";
import theme from "~/app/theme";
import { EngineIcon, VesselIcon } from "~/assets/icons";
import type { Vessel } from "~/generated/openapi";
import { selectGearGroupsMap, useAppSelector } from "~/store";
import { createOwnersListString } from "~/utils";

interface Props {
  vessel: Vessel;
}

interface InfoItemProps {
  label: string;
  value: string;
  icon: ReactNode;
  primary?: boolean;
}

const InfoItem: FC<InfoItemProps> = ({
  label,
  value,
  icon,
  primary = false,
}) => (
  <Stack
    direction={primary ? "row" : "column"}
    spacing={primary ? 1.5 : 0.75}
    sx={{
      alignItems: primary ? "flex-start" : "center",
      justifyContent: "center",
      width: "100%",
      minWidth: 0,
      textAlign: primary ? "left" : "center",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "secondary.main",
        "& svg": {
          fontSize: primary ? 32 : 32,
        },
      }}
    >
      {icon}
    </Box>

    <Stack
      spacing={0.25}
      sx={{
        minWidth: 0,
        alignItems: primary ? "flex-start" : "center",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontSize: "0.8rem",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "white",
          fontWeight: 600,
          fontSize: primary ? "1rem" : "1rem",
          lineHeight: 1.3,
        }}
      >
        {value}
      </Typography>
    </Stack>
  </Stack>
);

export const VesselInfo: FC<Props> = ({ vessel }) => {
  const gearGroups = useAppSelector(selectGearGroupsMap);
  const fiskeridir = vessel.fiskeridir;

  const gears = vessel.gearGroups
    .map((gg) => gearGroups[gg]?.name)
    .filter(Boolean)
    .join(", ");

  const specifications = [
    {
      label: "Lengde",
      value:
        fiskeridir.length != null
          ? `${Number(fiskeridir.length).toFixed(1)} m`
          : "Ukjent",
      icon: (
        <HeightIcon
          sx={{
            transform: "rotate(90deg)",
            stroke: "currentColor",
            strokeWidth: 1,
          }}
        />
      ),
    },
    {
      label: "Bredde",
      value:
        fiskeridir.width != null
          ? `${Number(fiskeridir.width).toFixed(1)} m`
          : "Ukjent",
      icon: (
        <HeightIcon
          sx={{
            stroke: "currentColor",
            strokeWidth: 1,
          }}
        />
      ),
    },
    {
      label: "Motorkraft",
      value:
        fiskeridir.enginePower != null
          ? `${Number(fiskeridir.enginePower).toLocaleString("nb-NO")} hk`
          : "Ukjent",
      icon: <EngineIcon width={34} height={34} />,
    },
  ];

  return (
    <Accordion
      disableGutters
      square
      elevation={0}
      sx={{
        bgcolor: "primary.light",
        color: "white",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
        sx={{
          px: 3,
          pt: 4,
          pb: 1.5,
          "& .MuiAccordionSummary-content": {
            my: 0,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ minWidth: 0, alignItems: "flex-start" }}
        >
          <Box sx={{ display: "flex", flexShrink: 0 }}>
            <VesselIcon
              fill={theme.palette.secondary.main}
              width={36}
              height={36}
            />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5">{fiskeridir.name ?? "Ukjent"}</Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "1rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fiskeridir.owners
                ? createOwnersListString(fiskeridir.owners)
                : "Ukjent eier"}
            </Typography>
          </Box>
        </Stack>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          px: 3,
          pt: 2,
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mb: 2.5,
            "& > :first-of-type": {
              flex: "1 1 50%",
              minWidth: 156,
              maxWidth: "calc((100% - 12px) / 2)",
            },
            "& > :last-of-type": {
              flex: "1 1 max-content",
              minWidth: 0,
            },
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 2,
              px: 3,
              py: 2.5,
              minWidth: 0,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <InfoItem
              primary
              label="Kallesignal"
              value={fiskeridir.callSign ?? "Ukjent"}
              icon={<SettingsInputAntennaIcon />}
            />
          </Box>

          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 2,
              px: 1,
              py: 2.5,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <InfoItem
              primary
              label="Redskap"
              value={gears || "Ukjent"}
              icon={<PhishingSharpIcon />}
            />
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: "rgba(255,255,255,0.15)",
            mb: 2.5,
          }}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            alignItems: "stretch",
          }}
        >
          {specifications.map((item, index) => (
            <Box
              key={item.label}
              sx={{
                minWidth: 0,
                px: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderLeft:
                  index > 0 ? "1px solid rgba(255,255,255,0.2)" : "none",
              }}
            >
              <InfoItem {...item} />
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
