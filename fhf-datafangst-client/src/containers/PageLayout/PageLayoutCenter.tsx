import { Box, SxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface Props {
  open?: boolean;
  sx?: SxProps;
  children?: ReactNode;
}

export const PageLayoutCenterFull: FC<Props> = (props) => (
  <Inner {...props} area="left / left / right / right" />
);

export const PageLayoutCenter: FC<Props> = (props) => (
  <Inner {...props} area="center" />
);

export const PageLayoutCenterTop: FC<Props> = (props) => (
  <Inner {...props} area="center-top" />
);

export const PageLayoutCenterBottom: FC<Props> = (props) => (
  <Inner {...props} area="center-bottom" />
);

interface PropsInner extends Props {
  area: string;
}

const Inner: FC<PropsInner> = ({ open = true, area, sx, children }) => {
  return open ? (
    <Box sx={sx} gridArea={area}>
      {children}
    </Box>
  ) : (
    <></>
  );
};
