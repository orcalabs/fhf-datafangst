import { HaulFilters } from "components";
import { Vessel } from "generated/openapi";
import { FC } from "react";

interface Props {
  selectedVessel?: Vessel;
}

export const MyHauls: FC<Props> = (props) => {
  const { selectedVessel } = props;

  return (
    <HaulFilters selectedVessel={selectedVessel} removeSingleEntryFilters />
  );
};
