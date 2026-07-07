import { Stroke, Style } from "ol/style";
import theme from "~/app/theme";
import { VectorLayer } from "~/components";
import { eezVector } from "~/utils";

const style = new Style({
  stroke: new Stroke({
    color: theme.palette.primary.light,
    width: 1.5,
  }),
});

export const EconomicZonesLayer = () => (
  <VectorLayer source={eezVector} style={style} zIndex={1} />
);
