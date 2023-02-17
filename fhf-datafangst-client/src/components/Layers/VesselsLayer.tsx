import { FC, useEffect, useState } from "react";
import Geometry from "ol/geom/Geometry";
import VectorSource from "ol/source/Vector";
import { VectorLayer } from "components";
import {
  changeIconSizeFromFeature,
  generateVesselsVector,
  updateVesselsVector,
} from "utils";
import { selectFishmapState, useAppSelector } from "store";
import { Vessel } from "models";
import { selectSelectedVessel, selectVessels } from "store/vessel";

export const VesselsLayer: FC = () => {
  const vessels = useAppSelector(selectVessels);
  const selectedVessel = useAppSelector(selectSelectedVessel);
  const state = useAppSelector(selectFishmapState);

  const [vesselsVector, setVesselsVector] = useState<VectorSource<Geometry>>();

  const [zoom, setZoom] = useState<number | undefined>(
    state.map.getView().getZoom()
  );

  const iconSize = zoom ? zoom * 0.018 : state.zoom * 0.018;

  // Store map zoom level in state
  useEffect(() => {
    state.map.on("moveend", function () {
      var zoom = state.map.getView().getZoom();
      if (zoom) {
        setZoom(zoom);
      }
    });
  }, [state.map]);

  // Change icon size from zoom level
  useEffect(() => {
    if (zoom) {
      vesselsVector?.forEachFeature((f) =>
        changeIconSizeFromFeature(
          f,
          (f.get("vessel") as Vessel).id === selectedVessel?.id
            ? iconSize * 2
            : iconSize
        )
      );
    }
  }, [zoom, iconSize, vesselsVector, selectedVessel]);

  useEffect(() => {
    if (vesselsVector && vessels) {
      updateVesselsVector(vesselsVector, vessels);
    } else {
      const vec = generateVesselsVector(vessels);
      setVesselsVector(vec);
    }
  }, [vessels, vesselsVector]);

  return <VectorLayer source={vesselsVector} zIndex={3} />;
};
