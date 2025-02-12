import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { CSSProperties, FC, ReactNode } from "react";

export interface Props {
  style?: CSSProperties;
  children: ReactNode;
}

export const OverlayScrollbars: FC<Props> = ({ style, children }) => {
  return (
    <OverlayScrollbarsComponent
      defer
      className="overlayscrollbars-react"
      options={{
        overflow: { x: "visible" },
        scrollbars: { theme: "os-theme-light" },
      }}
      style={style}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};
