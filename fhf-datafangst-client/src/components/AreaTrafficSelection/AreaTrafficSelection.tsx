import { Box, IconButton } from "@mui/material";
import { FC } from "react";
import {
  clearAreaDrawing,
  selectAreaDrawActive,
  setAreaDrawActive,
  useAppDispatch,
  useAppSelector,
} from "store";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";

export const AreaTrafficSelection: FC = () => {
  const dispatch = useAppDispatch();
  const areaActiveDraw = useAppSelector(selectAreaDrawActive);

  const handleClick = () => {
    if (!areaActiveDraw) {
      dispatch(setAreaDrawActive(true));
    } else {
      dispatch(clearAreaDrawing());
    }
  };

  return (
    <Box sx={{ ml: 1, zIndex: 1000, alignSelf: "center" }}>
      <IconButton
        sx={{
          border: "1px solid grey",
          bgcolor: areaActiveDraw ? "fourth.main" : "#DEDEDE",
          color: areaActiveDraw ? "white" : "",
          borderRadius: 0,
          "&:hover": {
            bgcolor: "fourth.main",
            color: "white",
          },
        }}
        title="Se båttrafikk (siste 7 dager) i valgt område"
        onClick={() => handleClick()}
      >
        <HighlightAltIcon />
      </IconButton>
    </Box>
  );
};
