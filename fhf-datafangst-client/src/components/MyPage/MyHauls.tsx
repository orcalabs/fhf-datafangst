import { HaulFilters } from "components";
import { Vessel } from "generated/openapi";
import { FC, useEffect } from "react";
import {
  initialHaulsMatrixSearch,
  selectHaulsMatrixSearch,
  setHaulsMatrixSearch,
  useAppDispatch,
  useAppSelector,
} from "store";

interface Props {
  selectedVessel?: Vessel;
}

export const MyHauls: FC<Props> = (props) => {
  const { selectedVessel } = props;
  const dispatch = useAppDispatch();
  const haulsSearch = useAppSelector(selectHaulsMatrixSearch);

  useEffect(() => {
    if (selectedVessel) {
      dispatch(
        setHaulsMatrixSearch({
          ...initialHaulsMatrixSearch,
          ...haulsSearch,
          filter: undefined,
          vessels: [selectedVessel],
        }),
      );
    }
  }, []);

  return (
    <HaulFilters selectedVessel={selectedVessel} removeSingleEntryFilters />
  );
};
