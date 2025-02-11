import { useMediaQuery } from "@mui/material";
import theme from "app/theme";
import { OverlayScrollbars } from "components";
import { HEADER_HEIGHT } from "components/Layout/Header";
import { FC, ReactNode } from "react";

interface Props {
  open?: boolean;
  children: ReactNode;
}

export const PageLayoutLeft: FC<Props> = (props) => (
  <PageLayoutSideMenu {...props} side="left" />
);

export const PageLayoutRight: FC<Props> = (props) => (
  <PageLayoutSideMenu {...props} side="right" />
);

interface PropsInner extends Props {
  side: "left" | "right";
}

const PageLayoutSideMenu: FC<PropsInner> = ({
  open = true,
  side,
  children,
}) => {
  const breakPoint = useMediaQuery(theme.breakpoints.up("xl"));

  if (!open) {
    return <></>;
  }

  return (
    <OverlayScrollbars
      style={{
        width: breakPoint ? "max(400px, 15vw)" : "max(400px, 18vw)",
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        color: "white",
        backgroundColor: theme.palette.primary.light,
        gridArea: side,
        zIndex: 1,
      }}
    >
      {children}
    </OverlayScrollbars>
  );
};
