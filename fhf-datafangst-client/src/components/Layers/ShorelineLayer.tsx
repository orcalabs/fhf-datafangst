import { VectorLayer } from "components";
import { generateShorelineVector } from "utils";
import { Stroke, Style } from "ol/style";
import theme from "app/theme";
import shoreline from "assets/geojson/shoreline.json";

const style = new Style({
  stroke: new Stroke({
    color: theme.palette.primary.light,
    width: 1.5,
  }),
});

export const ShorelineLayer = () => {
  const shorelineVector = generateShorelineVector(shoreline);

  return <VectorLayer source={shorelineVector} style={style} zIndex={1} />;
};
