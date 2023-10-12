import { FC, useEffect } from "react";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardHeader, Grid, Tooltip } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAppDispatch } from "store";
import { setBenchmarkModal } from "store/benchmark";

interface BenchmarkCardProps {
    title : string;
    value : number;
    description? : string;
    primary_color?: string;
    metric?: string;
    secondary_value? : number;
    tooltip?: string;
    secondary_description?: string;
    third_value? : number;
    third_description?: string;
    onClick?: () => void
}

export const BenchmarkCard: FC<BenchmarkCardProps> = (props) => {
    console.log(props.primary_color)
  return (
    <Tooltip title={props.tooltip}>
    <Card  variant="outlined" style={{ margin: "auto",  backgroundColor:"#067593"}}>
        <CardActionArea
            onClick={props.onClick}
        >
        <CardHeader
            avatar = {<AccessTimeIcon/>}
            title = {props.title}
            color="text.secondary"
            titleTypographyProps={{variant: 'h3'}}
            />
        <CardContent>
            <Grid container spacing={0}>
                {props.description && <Grid item xs = {12}>
                    <Typography color="text.secondary"> 
                        {props.description}
                    </Typography>
                </Grid>}
                <Grid item xs = {12} alignItems="center" justifyContent="center">
                    <Typography variant="h1" color={props.primary_color ? props.primary_color : "text.primary"} component="div" align="center">
                        {props.value.toFixed(2)} {props.metric}
                    </Typography>
                </Grid>
                {props.secondary_description && <Grid item xs = {6}>
                    <Typography color="text.secondary"> 
                        {props.secondary_description}
                    </Typography>
                </Grid>}
                {props.secondary_description && <Grid item xs = {6}>
                    <Typography variant="h4">
                        {props.secondary_value?.toFixed(2)} {props.metric}
                    </Typography>
                </Grid>}
                {props.third_description && <Grid item xs = {3}>
                    <Typography color="text.secondary"> 
                        {props.third_description}
                    </Typography>
                </Grid>}
                {props.third_value && <Grid item xs = {3}>
                    <Typography variant="h4">
                        {props.third_value.toFixed(2)} {props.metric}
                    </Typography>
                </Grid>}
            </Grid>
        </CardContent>
        </CardActionArea>
    </Card>
    </Tooltip>
  );
};
