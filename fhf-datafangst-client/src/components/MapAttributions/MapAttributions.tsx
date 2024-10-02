import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  IconButton,
  Link,
  Popper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "app/theme";
import mapboxLogo from "assets/logos/mapbox-logo-white.svg";
import { FC, useState } from "react";

export const MapAttributions: FC = () => {
  const lowRes = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.5}
      sx={{
        bottom: 5,
        position: "relative",
        fontSize: "small",
        right: "10px",
        zIndex: 10,
      }}
    >
      <Link
        href="http://mapbox.com/about/maps"
        target="_blank"
        sx={{
          height: "20px",
          width: "65px",
          textIndent: "-9999px",
          overflow: "hidden",
          backgroundImage: `url(${mapboxLogo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0",
          backgroundSize: "65px 20px",
        }}
      >
        Mapbox
      </Link>
      {lowRes ? (
        <>
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div>
              <IconButton
                onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
              >
                <InfoOutlinedIcon />
              </IconButton>
              <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="top-end"
              >
                <ButtonGroup
                  orientation="vertical"
                  onClick={() => setAnchorEl(null)}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    href="https://www.mapbox.com/about/maps/"
                    target="_blank"
                  >
                    © Mapbox
                  </Button>
                  <Button
                    href="http://www.openstreetmap.org/copyright"
                    size="small"
                    variant="outlined"
                    target="_blank"
                  >
                    © OpenStreetMap
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    href="https://www.mapbox.com/map-feedback/"
                    target="_blank"
                  >
                    Improve this map
                  </Button>
                </ButtonGroup>
              </Popper>
            </div>
          </ClickAwayListener>
        </>
      ) : (
        <>
          <Typography sx={{ fontSize: "small" }}>|</Typography>
          <Link href="https://www.mapbox.com/about/maps/">© Mapbox </Link>
          <Typography sx={{ fontSize: "small" }}>|</Typography>
          <Link href="http://www.openstreetmap.org/copyright">
            © OpenStreetMap
          </Link>
          <Typography sx={{ fontSize: "small" }}>|</Typography>
          <Link
            sx={{ pt: 0 }}
            href="https://www.mapbox.com/map-feedback/"
            target="_blank"
          >
            Improve this map
          </Link>
        </>
      )}
    </Stack>
  );
};
