import { Filters } from "components";
import { Vessel } from "generated/openapi";
import { FC, useEffect } from "react";
import {
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
          ...haulsSearch,
          filter: undefined,
          vessels: [selectedVessel],
        }),
      );
    }
  }, []);

  return <Filters selectedVessel={selectedVessel} removeSingleEntryFilters />;
};
