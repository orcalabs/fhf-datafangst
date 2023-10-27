import { FC } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, CardHeader, Grid, Tooltip } from "@mui/material";

interface BenchmarkCardProps {
  title: string;
  value: number | string;
  description?: string;
  primaryColor?: string;
  metric?: string;
  secondaryValue?: number | string;
  tooltip?: string;
  secondaryDescription?: string;
  thirdValue?: number | string;
  thirdDescription?: string;
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
            titleTypographyProps={{ variant: "h3", color: "text.secondary" }}
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
                    props.primaryColor ? props.primaryColor : "text.primary"
                  }
                  component="div"
                  align="center"
                >
                  {props.value} {props.metric ?? ""}
                </Typography>
              </Grid>
              {props.secondaryDescription && (
                <Grid item xs={3}>
                  <Typography color="text.secondary">
                    {props.secondaryDescription}
                  </Typography>
                </Grid>
              )}
              {props.secondaryDescription && (
                <Grid item xs={3}>
                  <Typography variant="h4" color="white">
                    {props.secondaryValue} {props.metric}
                  </Typography>
                </Grid>
              )}
              {props.thirdDescription && (
                <Grid item xs={3}>
                  <Typography color="text.secondary">
                    {props.thirdDescription}
                  </Typography>
                </Grid>
              )}
              {props.thirdValue && (
                <Grid item xs={3}>
                  <Typography variant="h4" color="white">
                    {props.thirdValue} {props.metric}
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
