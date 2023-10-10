import { FC, useEffect } from "react";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardHeader, Tooltip } from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface BenchmarkCardProps {
    title : string;
    value : number;
    secondary_value : number;
}

export const BenchmarkCard: FC<BenchmarkCardProps> = (props) => {

  return (
    <Tooltip title="Hello world">
    <Card  variant="outlined" color="primary">
        <CardHeader
            avatar = {<AccessTimeIcon/>}
            title = {props.title}
        />
        <CardContent>
        <Typography variant="h5" color="text.primary" component="div" sx={{fontSize: 30}}>
            {props.value}
        </Typography>
        <Typography variant="body2" color="text.secondary"> 
            Avg last x trips
        </Typography>
        <Typography variant="body2">
            {props.secondary_value}
        </Typography>
        </CardContent>
        <CardActions>
        <Button size="small">Info</Button>
        </CardActions>
    </Card>
    </Tooltip>
  );
};
