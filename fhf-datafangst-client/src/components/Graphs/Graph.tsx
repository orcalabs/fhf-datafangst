import ReactEChart from "echarts-for-react";

import { FC } from "react";
import { Box, Typography } from "@mui/material";

interface GraphProps {
    options: object;
    theme: object | string;
}

export const Graph: FC<GraphProps> = (props: GraphProps) => {
    return <Box>
        <ReactEChart option={props.options} theme={props.theme} />
    </Box>;
};
