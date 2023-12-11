import { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Box,
  CardActionArea,
  CardHeader,
  Divider,
  Tooltip,
} from "@mui/material";
import { fontStyle } from "app/theme";

interface BenchmarkCardProps {
  title: string;
  value: number | string;
  description: string;
  avatar: any;
  secondaryStat?: [string, string];
  thirdStat?: [string, string];
  tooltip?: string;
  onClick?: () => void;
}

export const BenchmarkCard: FC<BenchmarkCardProps> = (props) => {
  return (
    <Tooltip title={props.tooltip}>
      <Card
        variant="elevation"
        sx={{ m: "auto", bgcolor: "white", borderRadius: 2 }}
      >
        <CardActionArea onClick={props.onClick}>
          <CardHeader
            avatar={props.avatar}
            title={props.title}
            titleTypographyProps={{
              variant: "h4",
              color: "black",
              fontWeight: fontStyle.fontWeightSemiBold,
            }}
          />
          <CardContent>
            <Typography color="grey.A100">{props.description}</Typography>
            <Typography variant="h2" color="secondary.dark">
              {props.value}
            </Typography>
            {(props.secondaryStat ?? props.thirdStat) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Typography color="grey.A100" sx={{ width: 200 }}>
                    {props.secondaryStat?.[0]}
                  </Typography>
                  <Typography variant="h6">
                    {props.secondaryStat?.[1]}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Typography color="grey.A100" sx={{ width: 200 }}>
                    {props.thirdStat?.[0]}
                  </Typography>
                  <Typography variant="h6">{props.thirdStat?.[1]}</Typography>
                </Box>
              </>
            )}
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
};
