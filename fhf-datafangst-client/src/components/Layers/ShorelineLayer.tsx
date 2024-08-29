import theme from "app/theme";
import { VectorLayer } from "components";
import { Stroke, Style } from "ol/style";
import { shorelineVector } from "utils";

const style = new Style({
  stroke: new Stroke({
    color: theme.palette.primary.light,
    width: 1.5,
  }),
});

export const ShorelineLayer = () => (
  <VectorLayer source={shorelineVector} style={style} zIndex={1} />
);
