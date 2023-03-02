import { FC } from "react";
import { generateHaulsVector } from "utils";
import { VectorLayer } from "components";
import { selectHauls, useAppSelector } from "store";

export const HaulsLayer: FC = () => {
  const hauls = useAppSelector(selectHauls);
  const haulsVector = generateHaulsVector(hauls);

  return (
    <>
      <VectorLayer source={haulsVector} zIndex={5} />
    </>
  );
};
