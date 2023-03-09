import { FC } from "react";
import { generateHaulsVector } from "utils";
import { VectorLayer } from "components";
import { Haul } from "generated/openapi";

interface Props {
  hauls: Haul[];
}

export const HaulsLayer: FC<Props> = (props) => {
  const { hauls } = props;
  const haulsVector = generateHaulsVector(hauls);

  return (
    <>
      <VectorLayer source={haulsVector} zIndex={5} />
    </>
  );
};
