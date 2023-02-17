import React, { FC, useEffect } from "react";
import { defaults } from "ol/control";
import { View, Map as OLMap } from "ol";
import { Box } from "@mui/material";

import {
  initializeMap,
  selectFishmapState,
  useAppDispatch,
  useAppSelector,
} from "store";

interface Props {
  children: React.ReactNode;
}

export const Map: FC<Props> = (props) => {
  const { children } = props;

  const dispatch = useAppDispatch();

  const mapState = useAppSelector(selectFishmapState);

  useEffect(() => {
    const map = new OLMap({
      target: "map",
      layers: [],
      view: new View({
        center: mapState.centerCoordinate,
        zoom: mapState.zoom,
        zoomFactor: mapState.zoomFactor,
      }),
      controls: defaults({
        attribution: false,
        rotate: false,
        zoom: false,
      }),
    });

    dispatch(initializeMap(map));
  }, [dispatch, mapState.centerCoordinate, mapState.zoom, mapState.zoomFactor]);

  return (
    <Box id={"map"} sx={{ height: "100vh", width: "100%" }}>
      {children}
    </Box>
  );
};
