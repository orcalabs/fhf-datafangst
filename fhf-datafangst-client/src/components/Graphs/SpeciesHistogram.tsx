import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { selectBwUserProfile, selectVesselsByCallsign, useAppSelector } from "store";
import { Graph } from "./Graph";

export const Histogram: FC = () => {
    const options = {};
    const theme = {};

    return <Box>
        <Graph options={options} theme={theme} />
    </Box>;
};
