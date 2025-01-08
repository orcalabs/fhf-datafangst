import { Box, Typography } from "@mui/material";
import theme from "app/theme";
import { FC } from "react";

interface Props {
  title: string;
  subtitle: string;
  Icon: (props: any) => any;
}

export const Header: FC<Props> = (props) => {
  const { title, subtitle, Icon } = props;

  return (
    <Box sx={{ display: "flex", pt: 3, color: "white" }}>
      <Box>
        <Icon fill={theme.palette.secondary.main} width="36" height="36" />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="h5" color="white">
          {title}
        </Typography>
        <Typography
          color="textSecondary"
          variant="h6"
          sx={{
            fontSize: "1rem",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};
