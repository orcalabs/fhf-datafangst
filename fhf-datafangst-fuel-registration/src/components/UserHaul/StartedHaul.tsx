import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useState, type FC } from "react";
import theme from "~/app/theme";
import { FishIcon } from "~/assets/icons";
import type { StartedUserHaul } from "~/generated/openapi";
import { ConfirmHaulStopModal } from "../ConfirmModal/ConfirmHaulStopModal";
import { ConfirmModal, type Confirm } from "../ConfirmModal/ConfirmModal";
import { ElapsedTimer } from "../ElapsedTimer/ElapsedTimer";
import type { Config } from "./UserHaul";

interface Props {
  haul: StartedUserHaul;
  onStop: (fuelLiter: number) => void;
  onAbort: () => void;
}

interface ExpandMoreProps {
  expand: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

const ExpandMore = styled(({ expand, children, ...other }: ExpandMoreProps) => (
  <Button
    sx={{
      justifyContent: "flex-start",
      ":hover": {
        bgcolor: "transparent",
      },
    }}
    endIcon={
      <ExpandMoreIcon
        sx={{
          transform: expand ? "rotate(180deg)" : "rotate(0deg)",
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shortest,
            }),
        }}
      />
    }
    {...other}
  >
    {children}
  </Button>
))(() => ({
  textTransform: "none",
}));

export const StartedHaul: FC<Props> = (props) => {
  const { haul, onStop, onAbort } = props;
  const [expanded, setExpanded] = useState(false);
  const config: Config = { ...haul.config } as Config;

  const [confirmStopOpen, setConfirmStopOpen] = useState<boolean>(false);
  const [confirmAbort, setConfirmAbort] = useState<Confirm | undefined>(
    undefined,
  );

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Stack
            direction="row"
            spacing={3}
            sx={{ justifyContent: "space-between" }}
          >
            <Stack direction="row" spacing={3}>
              <FishIcon
                width="42"
                height="42"
                fill={theme.palette.primary.light}
              />
              <Stack>
                <Typography variant="h6" sx={{ color: "primary.light" }}>
                  Pågående hal
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  <ElapsedTimer startTimestamp={haul.startTs} />
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setConfirmStopOpen(true)}
              >
                Stopp hal
              </Button>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions
          sx={{ justifyContent: "space-between" }}
          onClick={handleExpandClick}
        >
          <ExpandMore expand={expanded}>
            <Typography
              variant="subtitle2"
              sx={{ width: 120, textAlign: "start" }}
            >
              {expanded ? "Skjul konfigurasjon" : "Vis konfigurasjon"}
            </Typography>
          </ExpandMore>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmAbort({
                message:
                  "Dette vil avbryte nåværende hal og slette all konfigurasjon og data tilhørende halet. Er du sikker?",
                onConfirm: onAbort,
              });
            }}
          >
            Avbryt hal
          </Button>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ bgcolor: "#F3F3F3" }}>
            <Stack spacing={1.5}>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Drivstoff ved start
                </Typography>
                <Typography>{haul.startFuelLiter}</Typography>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: "bold" }}>Trål</Typography>
                <Stack>
                  {config.trawl.map((t) => (
                    <Typography>{t.name}</Typography>
                  ))}
                </Stack>
              </Stack>
              <Stack>
                <Typography sx={{ fontWeight: "bold" }}>Lodd</Typography>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Antall</Typography>
                  <Typography>{config.clump.amount}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Vekt</Typography>
                  <Typography>{config.clump.weight}</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Typography sx={{ fontWeight: "bold" }}>Dører</Typography>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Antall</Typography>
                  <Typography>{config.doors.amount}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Vekt</Typography>
                  <Typography>{config.doors.weight}</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Typography sx={{ fontWeight: "bold" }}>Oversweeper</Typography>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Lengde</Typography>
                  <Typography>{config.oversweeper.length}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Tykkelse</Typography>
                  <Typography>{config.oversweeper.thickness}</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Typography sx={{ fontWeight: "bold" }}>
                  Undersweeper
                </Typography>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Lengde</Typography>
                  <Typography>{config.undersweeper.length}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Tykkelse</Typography>
                  <Typography>{config.undersweeper.thickness}</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Typography sx={{ fontWeight: "bold" }}>Gir</Typography>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Antall</Typography>
                  <Typography>{config.gear.amount}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Vekt</Typography>
                  <Typography>{config.gear.weight}</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Typography sx={{ fontWeight: "bold" }}>Bobbinser</Typography>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Antall</Typography>
                  <Typography>{config.bobbins.amount}</Typography>
                </Stack>
                <Stack
                  direction="row"
                  sx={{ ml: 1, justifyContent: "space-between" }}
                >
                  <Typography>Vekt</Typography>
                  <Typography>{config.bobbins.weight}</Typography>
                </Stack>
              </Stack>
              <Stack>
                <Typography sx={{ fontWeight: "bold" }}>Kommentarer</Typography>
                <Typography sx={{ ml: 1 }}>{config.comments}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Collapse>
      </Card>
      {confirmStopOpen && (
        <ConfirmHaulStopModal
          open
          startFuelLiter={haul.startFuelLiter}
          onClose={() => setConfirmStopOpen(false)}
          onConfirm={(fuelLiter: number) => onStop(fuelLiter)}
        />
      )}
      {confirmAbort && (
        <ConfirmModal
          {...confirmAbort}
          title="Bekreft avbryting"
          buttonConfirmText="Avbryt hal"
          open
          onClose={() => setConfirmAbort(undefined)}
        />
      )}
    </>
  );
};
