import { Box, SxProps, Tab as MuiTab, Tabs as MuiTabs } from "@mui/material";
import { fontStyle } from "app/theme";
import { FC, useEffect } from "react";
import { useSearchParams } from "react-router";

export interface Tab {
  key: string;
  Element: FC<any>;
  [k: string]: any;
}

export interface Props {
  tabs: Tab[];
  sx?: SxProps;
  onChange?: (key: string) => void;
}

export const Tabs: FC<Props> = ({ tabs, sx, onChange }) => {
  const [params, setParams] = useSearchParams();

  const tabKey = params.get("tab");

  const { key, Element, ...props } =
    tabs.find(({ key }) => key === tabKey) ?? tabs[0];

  useEffect(() => onChange?.(key), [key]);

  return (
    <Box id="tabs-wrapper">
      <MuiTabs
        centered
        indicatorColor="primary"
        sx={{
          width: "fit-content",
          marginInline: "auto",
          "& .MuiTab-root": {
            color: "#818799",
            borderBottom: "1px solid #5B5B5B",
            "&:hover": {
              color: "primary.main",
            },
            "&.Mui-selected": {
              color: "primary.main",
              fontWeight: fontStyle.fontWeightSemiBold,
            },
          },
        }}
        value={key}
        onChange={(_, tab: string) => setParams({ tab })}
      >
        {tabs.map(({ key }) => (
          <MuiTab key={key} value={key} label={key} />
        ))}
      </MuiTabs>
      <Box sx={{ pt: 3, ...sx }}>{<Element {...props} />}</Box>
    </Box>
  );
};
