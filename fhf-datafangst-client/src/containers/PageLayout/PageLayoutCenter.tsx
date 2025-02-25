import { Stack, SxProps } from "@mui/material";
import { HEADER_HEIGHT } from "components/Layout/Header";
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
  if (!open) {
    return <></>;
  }

  return (
    <Stack
      gridArea={area}
      sx={{
        maxHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
};
