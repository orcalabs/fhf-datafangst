import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { CSSProperties, FC, ReactNode } from "react";

export interface Props {
  style?: CSSProperties;
  children: ReactNode;
  darkTheme?: boolean;
}

export const OverlayScrollbars: FC<Props> = ({
  style,
  children,
  darkTheme,
}) => {
  return (
    <OverlayScrollbarsComponent
      defer
      className="overlayscrollbars-react"
      options={{
        overflow: { x: "visible" },
        scrollbars: { theme: darkTheme ? "os-theme-dark" : "os-theme-light" },
      }}
      style={style}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};
