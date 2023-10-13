import { FC } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardHeader, Grid, Tooltip } from "@mui/material";

interface BenchmarkCardProps {
  title: string;
  value: number;
  description?: string;
  primary_color?: string;
  metric?: string;
  secondary_value?: number;
  tooltip?: string;
  secondary_description?: string;
  third_value?: number;
  third_description?: string;
  avatar: any;
  onClick?: () => void;
}

export const BenchmarkCard: FC<BenchmarkCardProps> = (props) => {
  return (
    <Tooltip title={props.tooltip}>
      <Card
        variant="outlined"
        style={{ margin: "auto", backgroundColor: "#067593" }}
      >
        <CardActionArea onClick={props.onClick}>
          <CardHeader
            avatar={props.avatar}
            title={props.title}
            color="text.secondary"
            titleTypographyProps={{ variant: "h3" }}
          />
          <CardContent>
            <Grid container spacing={0}>
              {props.description && (
                <Grid item xs={12}>
                  <Typography color="text.secondary">
                    {props.description}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} alignItems="center" justifyContent="center">
                <Typography
                  variant="h1"
                  color={
                    props.primary_color ? props.primary_color : "text.primary"
                  }
                  component="div"
                  align="center"
                >
                  {props.value.toFixed(2)} {props.metric}
                </Typography>
              </Grid>
              {props.secondary_description && (
                <Grid item xs={6}>
                  <Typography color="text.secondary">
                    {props.secondary_description}
                  </Typography>
                </Grid>
              )}
              {props.secondary_description && (
                <Grid item xs={6}>
                  <Typography variant="h4">
                    {props.secondary_value?.toFixed(2)} {props.metric}
                  </Typography>
                </Grid>
              )}
              {props.third_description && (
                <Grid item xs={3}>
                  <Typography color="text.secondary">
                    {props.third_description}
                  </Typography>
                </Grid>
              )}
              {props.third_value && (
                <Grid item xs={3}>
                  <Typography variant="h4">
                    {props.third_value.toFixed(2)} {props.metric}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
};
