import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import type { ReactNode } from "react";
import React from "react";

interface Props {
  children: ReactNode;
}

export const LayoutDesktop: React.FC<Props> = ({ children }) => {
  return (
    <OverlayScrollbarsComponent
      className="overlayscrollbars-react"
      options={{
        scrollbars: { theme: "os-theme-dark" },
      }}
      defer
    >
      <main style={{ height: "calc(100vh - 64px)", top: 64 }}>{children}</main>
    </OverlayScrollbarsComponent>
  );
};

export default LayoutDesktop;
