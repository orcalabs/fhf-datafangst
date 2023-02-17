import { MapBoxLayer, Map } from "components";
import { FC } from "react";

export const HomeView: FC = () => {
  return (
    <Map>
      <MapBoxLayer />
    </Map>
  );
};
